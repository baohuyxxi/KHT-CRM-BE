import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: '64f94d5e8b7b9c7f12345678' })
  @IsMongoId()
  tenantId: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;
}
