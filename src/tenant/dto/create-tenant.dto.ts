import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({ example: 'Công ty ABC', description: 'Tên công ty/tenant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ABC123', description: 'Mã duy nhất của tenant' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: '123 Đường A, TP.HCM' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'contact@abc.com' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+84 912345678' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({
    example: '64f2b13c6d1c9f4a3c123456',
    description: 'ID user tạo tenant',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Trạng thái hoạt động của tenant',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean; // 👈 seed sẽ dùng được
}
