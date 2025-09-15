import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength, IsDateString } from 'class-validator';
import { Types } from 'mongoose';
import { CustomerType } from '../schemas/customer.schema';

export class CreateCustomerDto {
    @ApiProperty({ example: '68b80a17c930100f5a6322e3', description: 'ID của User sở hữu khách hàng' })
    @IsNotEmpty()
    @IsString()
    owner: Types.ObjectId;

    @ApiProperty({ example: '012345678901', description: 'CCCD/CMND' })
    @IsString()
    @IsNotEmpty()
    @MinLength(9)
    @MaxLength(12)
    citizenId: string;

    @ApiProperty({ example: 'Nguyen', required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty({ example: 'Van A', required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty({ example: '1995-05-10', required: false })
    @IsOptional()
    @IsDateString()
    dob?: Date;

    @ApiProperty({ enum: ['Nam', 'Nữ', 'Khác'], example: 'Nam', required: false })
    @IsOptional()
    @IsEnum(['Nam', 'Nữ', 'Khác'])
    gender?: string;

    @ApiProperty({ example: '123 Đường ABC, Quận 1, TP.HCM', required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ example: '0912345678', required: false })
    @IsOptional()
    @Matches(/^[0-9]{10,11}$/, { message: 'Số điện thoại phải có 10-11 chữ số' })
    phone?: string;

    @ApiProperty({ example: 'customer@gmail.com', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ enum: CustomerType, example: CustomerType.POTENTIAL })
    @IsNotEmpty()
    @IsEnum(CustomerType)
    customerType: CustomerType;
}
