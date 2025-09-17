import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString, IsBoolean } from 'class-validator';
import { BusinessType } from '../schemas/business.schema';
import { Types } from 'mongoose';

export class CreateBusinessDto {
    @ApiProperty({ example: 'Công ty TNHH ABC', description: 'Tên doanh nghiệp' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '123 Đường ABC, Quận 1, TP.HCM', required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ example: '0912345678', required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ example: 'info@abc.com', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: '68b80a17c930100f5a6322e3', description: 'ID của User quản lý doanh nghiệp' })
    @IsNotEmpty()
    @IsString()
    owner: Types.ObjectId;

    @ApiProperty({ enum: BusinessType, example: BusinessType.ORGANIZATION, required: false })
    @IsOptional()
    @IsEnum(BusinessType)
    type?: BusinessType;

    @ApiProperty({ example: '0123456789', required: false })
    @IsOptional()
    @IsString()
    taxId?: string;

    @ApiProperty({ example: 'GPKD-001', required: false })
    @IsOptional()
    @IsString()
    licenseCode?: string;

    @ApiProperty({ example: 'uploads/file.pdf', required: false })
    @IsOptional()
    @IsString()
    licenseFile?: string;

    @ApiProperty({ example: '2025-09-15', required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ example: '123456789', required: false })
    @IsOptional()
    @IsString()
    representativeId?: string;

    @ApiProperty({ example: 'Nguyen Van A', required: false })
    @IsOptional()
    @IsString()
    representativeName?: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiProperty({ example: 'KH0000012', description: 'cusId của Customer liên kết' })
    @IsNotEmpty()
    @IsString()
    cusId: string;
}
