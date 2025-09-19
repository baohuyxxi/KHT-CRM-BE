import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum TaskType {
  SIGNING = 'signing',
  CUSTOMER_CONTACT = 'customer_contact',
  PRODUCT_PRICE_UPDATE = 'product_price_update',
  OTHER = 'other',
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsEnum(TaskType)
  type: TaskType;

  @IsString()
  @IsOptional()
  details?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsOptional()
  pdfs?: string[];

  @IsArray()
  @IsOptional()
  assigneeIds?: string[];
}
