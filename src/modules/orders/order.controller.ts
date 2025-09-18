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
    async getAllOrders(@Req() req: express.Request) {
        // const user = req.user as { userId: string; roles: string[] };
        return await this.orderService.findAll();
    }

    @Get('/:id')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.ORDER_READ_ANY)
    async getOrderById(@Param('id') id: string) {
        return await this.orderService.findById(id);
    }
}
