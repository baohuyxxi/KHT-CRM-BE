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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permission.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import * as express from 'express';

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
    async getAllOrders(@Req() req: express.Request) {
        const user = req.user as { userId: string; roles: string[] };
        return await this.orderService.findAllByUserId(user.userId);
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_READ_ANY)
    async getOrderById(@Param('id') id: string) {
        return await this.orderService.findById(id);
    }
}
