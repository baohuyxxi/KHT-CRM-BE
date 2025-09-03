import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { UploadFileDto } from './dto/upload.dto';

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File, dto: UploadFileDto): Promise<any> {
        if (!file || !file.buffer) {
            throw new Error('File not found or buffer is missing');
        }

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: dto.folder || 'images' },  // 👈 dùng folder từ dto
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed'));
                    resolve(result);
                },
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });

        return {
            url: result.secure_url,
            public_id: result.public_id,
            title: dto.title,
            description: dto.description,
            folder: dto.folder,
        };
    }

    async uploadFiles(files: Express.Multer.File[], dto: UploadFileDto): Promise<any[]> {
        if (!files || files.length === 0) {
            throw new Error('No files found or buffers are missing');
        }

        const result = await Promise.all(files.map(file => {
            return new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: dto.folder || 'images' },  // 👈 dùng folder từ dto
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('Upload failed'));
                        resolve(result);
                    },
                );
                try {
                    streamifier.createReadStream(file.buffer).pipe(uploadStream);
                } catch (err) {
                    reject(new InternalServerErrorException('Stream error: ' + err.message));
                }
            });
        }));

        return result.map(item => ({
            url: item.secure_url,
            public_id: item.public_id,
            title: dto.title,
            description: dto.description,
            folder: dto.folder,
        }));
    }
}
