import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsNumber,
    IsEnum,
    IsBoolean,
} from 'class-validator';

export enum OrderType {
    PRODUCT = 'SP',
    SERVICE = 'DV',
}

export enum PaymentStatus {
    UNPAID = 'Chưa thanh toán',
    PARTIAL = 'Thanh toán một phần',
    PAID = 'Đã thanh toán',
}

export enum OrderStatus {
    PENDING = 'Chờ xử lý',
    ACTIVE = 'Đang hiệu lực',
    COMPLETED = 'Hoàn thành',
    CANCELLED = 'Đã hủy',
}

export class CreateOrderDto {
    @ApiProperty({ example: 'SP', enum: OrderType })
    @IsEnum(OrderType)
    type: OrderType;

    @ApiProperty({ example: 'Gói dịch vụ kế toán' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'KH0000012' })
    @IsString()
    @IsNotEmpty()
    cusId: string;

    @ApiProperty({ example: '0123456789' })
    @IsString()
    @IsOptional()
    cusCitizenId?: string;

    @ApiProperty({ example: 'Nguyễn Văn A' })
    @IsString()
    @IsOptional()
    cusName?: string;

    @ApiProperty({ example: 'DN0000004' })
    @IsString()
    @IsOptional()
    busId?: string;

    @ApiProperty({ example: '1234567890' })
    @IsString()
    @IsOptional()
    busTaxId?: string;

    @ApiProperty({ example: 'Công ty ABC' })
    @IsString()
    @IsOptional()
    busName?: string;

    @ApiProperty({ example: '2025-09-18' })
    @IsDateString()
    @IsOptional()
    registerDate?: Date;

    @ApiProperty({ example: '2025-10-01' })
    @IsDateString()
    @IsOptional()
    startDate?: Date;

    @ApiProperty({ example: '12 tháng' })
    @IsString()
    @IsOptional()
    guarantee?: string;

    @ApiProperty({ example: '2026-10-01' })
    @IsDateString()
    @IsOptional()
    expire?: Date;

    @ApiProperty({ example: '2026-09-30' })
    @IsDateString()
    @IsOptional()
    expectedEnd?: Date;

    @ApiProperty({ example: 1000000 })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ example: 'Đã thanh toán', enum: PaymentStatus })
    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

    @ApiProperty({ example: 500000 })
    @IsNumber()
    @IsOptional()
    paid?: number;

    @ApiProperty({ example: 'Đang hiệu lực', enum: OrderStatus })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiProperty({ example: true })
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}
