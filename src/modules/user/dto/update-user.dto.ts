import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Nguyen Van A', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'avatar.png', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
