import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Permission } from 'src/auth/permissions.enum';

@Controller('tasks')
export class UserController {
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_READ_ANY) // yêu cầu quyền user:read
  findAll() {
    return [{ id: 1, name: 'Test User' }];
  }
}
