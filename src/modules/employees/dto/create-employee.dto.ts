import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: 'tenantIdHere' })
  @IsMongoId()
  tenantId: string;
}
