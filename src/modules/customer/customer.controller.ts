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
  Query,
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
  constructor(private readonly customerService: CustomerService) { }

  @Post('add')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_CREATE)
  async addCustomer(@Body() body: CreateCustomerDto) {
    return await this.customerService.createCustomer(body);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_UPDATE_ANY)
  async updateCustomer(
    @Param('id') id: string,
    @Body() body: Partial<CreateCustomerDto>,
  ) {
    return await this.customerService.updateCustomer(id, body);
  }

  //Get all customers of a user
  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_READ_ANY)
  async getAllCustomers(
    @Req() req: express.Request,
    @Query('type') type?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    type = type || 'Đã là khách hàng';
    page = page || 1;
    limit = limit || 10;
    const user = req.user as { userId: string; roles: string[] };
    const result = await this.customerService.findAllByUserId(user.userId, type, page, limit);
    return result;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_READ_ANY)
  async getCustomerById(@Param('id') id: string) {
    return await this.customerService.findById(id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_DELETE_ANY)
  async deleteCustomer(@Param('id') id: string) {
    return await this.customerService.deleteCustomer(id);
  }

  @Get('invoices/get-code')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_READ_ANY)
  async getInvoicesOfCustomer() {
    return await this.customerService.getCounterInvoice();
  }

  @Post('invoices/:cusId/:invoiceCode')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_UPDATE_ANY)
  async addInvoiceToCustomer(
    @Param('cusId') cusId: string,
    @Param('invoiceCode') invoiceCode: string,
    @Body("file") file: string,
    @Body("invoiceCode") invoiceCodeBody: string,
    @Body("ordIds") ordIds: string[],
  ) {
    const invoiceData = { invoiceCode: invoiceCodeBody, file, ordIds };
    return await this.customerService.saveInvoice(cusId, invoiceCode, invoiceData);
  }

  @Delete('invoices/:cusId/:invoiceCode')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.CUSTOMER_UPDATE_ANY)
  async removeInvoiceFromCustomer(
    @Param('cusId') cusId: string,
    @Param('invoiceCode') invoiceCode: string,
  ) {
    return await this.customerService.removeInvoice(cusId, invoiceCode);
  }
}
