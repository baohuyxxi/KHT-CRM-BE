import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@Controller('employees')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @Permissions(Permission.EMPLOYEE_READ_ANY)
  async findAll(@Request() req: any) {
    const tenantId = req.user.tenantId; // lấy từ token
    const query = { ...req.query, tenantId };
    return this.employeesService.findAll(query);
  }

  @Get(':id')
  @Permissions(Permission.EMPLOYEE_READ_ANY)
  // eslint-disable-next-line @typescript-eslint/require-await
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Put(':id')
  @Permissions(Permission.EMPLOYEE_UPDATE_ANY)
  // eslint-disable-next-line @typescript-eslint/require-await
  async update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }

  // Lấy quyền hiện tại của user
  @Get(':id/permissions')
  @Permissions(Permission.EMPLOYEE_READ_ANY)
  async getPermissions(@Param('id') id: string) {
    const permissions = await this.employeesService.findById(id);
    if (!permissions) throw new NotFoundException('User not found');
    return {
      data: permissions,
      message: `Quyền hiện tại của user ${id}`,
    };
  }

  @Put(':id/permissions')
  @Permissions(Permission.EMPLOYEE_UPDATE_ANY)
  async updatePermissions(
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
  ) {
    const updatedUser = await this.employeesService.updatePermissions(
      id,
      permissions,
    );
    return {
      data: updatedUser,
      message: `Cập nhật quyền cho user ${id} thành công`,
    };
  }
}
