import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/business.dto';
import { Business } from './schemas/business.schema';
import { Permission } from '../auth/permissions.enum';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import express from 'express';

@ApiTags('Businesses')
@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) { }
  // Add more endpoints as needed

  @Post('add')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.BUSINESS_CREATE)
  async createBusiness(@Body() body: CreateBusinessDto): Promise<Business> {
    return this.businessService.createBusiness(body);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.BUSINESS_UPDATE_ANY)
  async updateBusiness(
    @Param('id') id: string,
    @Body() body: Partial<CreateBusinessDto>,
  ): Promise<Business | null> {
    return this.businessService.updateBusiness(id, body);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.BUSINESS_READ_OWN, Permission.BUSINESS_READ_ANY)
  async findOneBybusId(@Param('id') busId: string): Promise<Business | null> {
    return this.businessService.findOneBybusId(busId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.BUSINESS_READ_OWN, Permission.BUSINESS_READ_ANY)
  async findAllOfOwner(@Req() req: express.Request): Promise<Business[]> {
    const user = req.user as { userId: string; roles: string[] };
    return this.businessService.findAllOfOwner(user.userId);
  }

  @Delete('unlink-customer/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.BUSINESS_UPDATE_ANY)
  async deleteLinkedCustomerFromBusiness(
    @Param('id') busId: string,
  ): Promise<{ message: string }> {
    await this.businessService.deleteLinkedCustomerFromBusiness(busId);
    return { message: `Customer unlinked from business ${busId} successfully.` };
  }

  @Delete('/delete/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.BUSINESS_DELETE_ANY)
  async deleteBusiness(@Param('id') busId: string): Promise<{ message: string }> {
    await this.businessService.deleteBusiness(busId);
    return { message: `Business ${busId} deleted successfully.` };
  }

  @Put('link-customer/:id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.BUSINESS_UPDATE_ANY)
  async linkCustomerToBusiness(
    @Param('id') busId: string,
    @Body('cusId') cusId: string,
  ): Promise<Business | null> {
    return this.businessService.linkCustomerToBusiness(busId, cusId);
  }

}
