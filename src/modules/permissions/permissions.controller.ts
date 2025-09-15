// src/modules/permissions/permissions.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  async findAll() {
    return {
      data: await this.permissionsService.findAll(),
      message: 'Danh sách tất cả quyền trong hệ thống',
    };
  }
}
