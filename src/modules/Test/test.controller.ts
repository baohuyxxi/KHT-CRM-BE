// src/test/test.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@Controller('test')
export class TestController {
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_READ_ANY) // 👈 yêu cầu quyền user:read
  getTest() {
    return { message: 'You have permission: user:read ✅' };
  }
}
