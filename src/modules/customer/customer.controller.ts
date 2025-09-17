import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions.enum';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/add.dto';
import express from 'express';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.USER_CREATE_ANY)
  async addCustomer(@Body() body: CreateCustomerDto) {
    return await this.customerService.createCustomer(body);
  }

  //Get all customers of a user
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.USER_READ_ANY)
  async getAllCustomers(@Req() req: express.Request) {
    const user = req.user as { userId: string; roles: string[] };
    return await this.customerService.findAllByUserId(user.userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.USER_READ_ANY)
  async getCustomerById(@Param('id') id: string) {
    return await this.customerService.findById(id);
  }
}
