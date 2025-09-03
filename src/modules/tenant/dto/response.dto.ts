import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Action successful', required: false })
  message?: string;

  // Chỗ này Swagger không render generic trực tiếp,
  // nên trong controller ta phải chỉ định bằng `type`
  @ApiProperty()
  data: T;
}
