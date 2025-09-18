import {
    Controller,
    Post,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    Body,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload.dto';
import { memoryStorage } from 'multer';


@ApiTags('cloudinary')
@Controller('image')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(), // 👈 phải dùng memoryStorage để có file.buffer
    }))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,  // 👈 file lấy qua decorator này
        @Body() uploadFileDto: UploadFileDto,       // 👈 metadata từ body
    ) {
        if (!file || !file.buffer) {
            throw new BadRequestException('File not found or buffer is missing');
        }

        try {
            return await this.cloudinaryService.uploadFile(file, uploadFileDto);
        } catch (err) {
            throw new InternalServerErrorException(err.message || 'Upload failed');
        }
    }

    @Post('uploads')
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: memoryStorage(), // 👈 phải dùng memoryStorage để có file.buffer
    }))
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],  // 👈 file lấy qua decorator này
        @Body() uploadFileDto: UploadFileDto,            // 👈 metadata từ body
    ) {
        if (!files || files.length === 0 || !files[0].buffer) {
            throw new BadRequestException('File not found or buffer is missing');
        }

        try {
            return await this.cloudinaryService.uploadFiles(files, uploadFileDto);
        } catch (err) {
            throw new InternalServerErrorException(err.message || 'Upload failed');
        }
    }

}

@Controller('pdf')
export class PdfController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(),
    }))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadFileDto: any,
    ) {
        if (!file || !file.buffer) {
            throw new BadRequestException('File not found or buffer is missing');
        }

        try {
            return await this.cloudinaryService.uploadPDF(file, uploadFileDto);
        } catch (err) {
            throw new InternalServerErrorException(err.message || 'Upload failed');
        }
    }

    // Upload nhiều file PDF
    @Post('uploads')
    @UseInterceptors(FilesInterceptor('files', 10, { storage: memoryStorage() }))
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() uploadFileDto: any,
    ) {
        if (!files || files.length === 0 || !files[0].buffer) {
            throw new BadRequestException('Files not found or buffer is missing');
        }

        try {
            return await this.cloudinaryService.uploadPDFs(files, uploadFileDto);
        } catch (err) {
            throw new InternalServerErrorException(err.message || 'Upload failed');
        }
    }
}