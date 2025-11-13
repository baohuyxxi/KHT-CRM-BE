import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Counter, CounterSchema, Customer, CustomerSchema } from "./schemas/customer.schema";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";
import { Order, OrderSchema } from "../orders/schemas/order.schema";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }, { name: Counter.name, schema: CounterSchema }, { name: Order.name, schema: OrderSchema }]),
    ],
    controllers: [CustomerController],
    providers: [CustomerService],
    exports: [CustomerService],
})
export class CustomerModule { }