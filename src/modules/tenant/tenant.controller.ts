import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { Tenant } from './schemas/tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';
import {
  ResponseDtoFactory,
  ResponseArrayDtoFactory,
} from 'src/common/dto/response.dto';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  @ApiOkResponse({
    description: 'Tenant created successfully',
    type: ResponseDtoFactory(Tenant),
  })
  async create(@Body() body: CreateTenantDto) {
    const data = await this.tenantService.createTenant(body);
    return { success: true, message: 'Tenant created successfully', data };
  }

  @Get()
  @ApiOkResponse({
    description: 'List tenants',
    type: ResponseArrayDtoFactory(Tenant),
  })
  async findAll() {
    const data = await this.tenantService.findAll();
    return { success: true, message: 'List tenants', data };
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Get tenant by id',
    type: ResponseDtoFactory(Tenant),
  })
  async findById(@Param('id') id: string) {
    const data = await this.tenantService.findById(id);
    return { success: true, message: 'Get tenant by id', data };
  }

  @Get('code/:code')
  @ApiOkResponse({
    description: 'Get tenant by code',
    type: ResponseDtoFactory(Tenant),
  })
  async findByCode(@Param('code') code: string) {
    const data = await this.tenantService.findByCode(code);
    return { success: true, message: 'Get tenant by code', data };
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Update tenant by id',
    type: ResponseDtoFactory(Tenant),
  })
  async update(
    @Param('id') id: string,
    @Body() body: Partial<CreateTenantDto>,
  ) {
    const data = await this.tenantService.updateTenant(id, body);
    return { success: true, message: 'Tenant updated successfully', data };
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete tenant by id',
    type: ResponseDtoFactory(Boolean),
  })
  async delete(@Param('id') id: string) {
    await this.tenantService.deleteTenant(id);
    return {
      success: true,
      message: 'Tenant deleted successfully',
      data: true,
    };
  }
}
