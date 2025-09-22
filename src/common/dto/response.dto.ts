import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class ResponseDto<TData> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  data: TData;

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;
}

// ✅ Factory cho single object
export function ResponseDtoFactory<TModel extends Type<any>>(model: TModel) {
  class ResponseDtoWithModel extends ResponseDto<InstanceType<TModel>> {
    @ApiProperty({ type: model })
    declare data: InstanceType<TModel>;
  }

  // 👇 đổi tên class cho Swagger
  Object.defineProperty(ResponseDtoWithModel, 'name', {
    value: `${model.name}ResponseDto`,
  });

  return ResponseDtoWithModel;
}

// ✅ Factory cho array object
export function ResponseArrayDtoFactory<TModel extends Type<any>>(
  model: TModel,
) {
  class ResponseDtoWithArrayModel extends ResponseDto<InstanceType<TModel>[]> {
    @ApiProperty({ type: [model] })
    declare data: InstanceType<TModel>[];
  }

  // 👇 đổi tên class cho Swagger
  Object.defineProperty(ResponseDtoWithArrayModel, 'name', {
    value: `${model.name}ArrayResponseDto`,
  });

  return ResponseDtoWithArrayModel;
}
