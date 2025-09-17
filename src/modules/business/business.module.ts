import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Business, BusinessSchema } from "./schemas/business.schema";
import { BusinessController } from "./business.controller";
import { BusinessService } from "./business.service";
import { Counter, CounterSchema } from "../customer/schemas/customer.schema";


@Module({
    imports: [MongooseModule.forFeature([{ name: Business.name, schema: BusinessSchema }, { name: Counter.name, schema: CounterSchema }])], // <-- thêm Counter])],
    controllers: [BusinessController],
    providers: [BusinessService],
    exports: [BusinessService],
})
export class BusinessModule { }