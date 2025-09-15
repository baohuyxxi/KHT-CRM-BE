import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Counter, CounterSchema, Customer, CustomerSchema } from "./schemas/customer.schema";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }, { name: Counter.name, schema: CounterSchema },])
    ],
    controllers: [CustomerController],
    providers: [CustomerService],
    exports: [CustomerService],
})
export class CustomerModule { }