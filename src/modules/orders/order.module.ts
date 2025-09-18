import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Counter, CounterSchema, Order, OrderSchema } from "./schemas/order.schema";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }, { name: Counter.name, schema: CounterSchema }])
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule { }