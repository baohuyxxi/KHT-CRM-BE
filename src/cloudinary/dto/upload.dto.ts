import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    folder?: string;
}
