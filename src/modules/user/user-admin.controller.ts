import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '../auth/guards/permissions.guard';
import { Permission } from '../auth/permissions.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UserAdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequirePermissions(Permission.USER_READ_ANY)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermissions(Permission.USER_READ_ANY)
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @RequirePermissions(Permission.USER_UPDATE_ANY)
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.USER_UPDATE_ANY) // hoặc Permission.USER_DELETE_ANY nếu bạn muốn chi tiết hơn
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
