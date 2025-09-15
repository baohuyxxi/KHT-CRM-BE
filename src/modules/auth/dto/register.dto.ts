import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'ID của tenant mà user thuộc về',
    example: '64f2b1c1234abcdef5678901',
  })
  @IsMongoId()
  tenantId: string;

  @ApiProperty({
    description: 'Email của user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu của user, tối thiểu 6 ký tự',
    example: '123456',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Tên đầy đủ của user',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  name: string;
}
