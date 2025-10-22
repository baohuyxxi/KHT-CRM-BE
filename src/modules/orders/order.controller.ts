import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    UseGuards,
    NotFoundException,
    Query,
    Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/permissions.enum';
import { CreateOrderDto } from './dto/order.dto';
import * as express from 'express';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @Post('add')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_CREATE)
    async addOrder(@Body() body: CreateOrderDto) {
        return await this.orderService.createOrder(body);
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_UPDATE_ANY)
    async updateOrder(
        @Param('id') id: string,
        @Body() body: Partial<CreateOrderDto>,
    ) {
        return await this.orderService.updateOrder(id, body);
    }

    // Get all orders of a user
    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_READ_ANY)
    async getAllOrders(@Req() req: express.Request, @Query('page') page = 1, @Query('limit') limit = 50, @Query('type') type: string = 'SP') {
        // const user = req.user as { userId: string; roles: string[] };
        return await this.orderService.findAllByUserId('', type, limit, page);
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_READ_ANY)
    async getOrderById(@Param('id') id: string) {
        return await this.orderService.findById(id);
    }

    @Post('extend/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_CREATE)
    async extendOrder(
        @Param('id') id: string,
        @Body() body: CreateOrderDto,
    ) {
        const existingOrder = await this.orderService.findById(id);
        if (!existingOrder) {
            throw new NotFoundException(`Order with id ${id} not found.`);
        }
        return await this.orderService.extendOrder(id, body);
    }

    @Get('customer/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_READ_ANY)
    async getOrdersByCustomer(@Param('id') id: string, @Query('page') page = 1, @Query('limit') limit = 50) {
        return await this.orderService.getOrderOfCustomer(id, limit, page);
    }

    @Get('filter/search')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_READ_ANY)
    async filterOrders(@Query() query: any) {
        const { type, search, name, reqType, startDate, endDate, paymentStatus, status, limit, page } = query;
        return await this.orderService.filterOrders(type, search, name, reqType, startDate, endDate, paymentStatus, status, limit, page);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_DELETE_OWN)
    async deleteOrder(@Param('id') id: string) {
        return await this.orderService.deleteOrder(id);
    }
}
