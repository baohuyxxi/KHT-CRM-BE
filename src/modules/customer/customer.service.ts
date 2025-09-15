import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Counter, Customer, CustomerDocument } from "./schemas/customer.schema";
import { Model } from "mongoose";
import { CreateCustomerDto } from "./dto/add.dto";
import * as jwt from 'jsonwebtoken';


@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
        @InjectModel(Counter.name) private counterModel: Model<Counter>,
    ) { }

    async createCustomer(data: CreateCustomerDto): Promise<Customer> {
        const session = await this.customerModel.db.startSession();
        session.startTransaction();

        try {
            const counter = await this.counterModel.findByIdAndUpdate(
                'customers',
                { $inc: { seq: 1 } },
                { new: true, upsert: true, session }
            );

            const cusId = 'KH' + counter.seq.toString().padStart(7, '0');
            const newCustomer = new this.customerModel({ ...data, cusId });

            await newCustomer.save({ session });
            await session.commitTransaction();

            return newCustomer;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        }
    }

    async findAllByUserId(userId): Promise<Customer[]> {
        console.log('Decoded userId from token:', userId);
        return this.customerModel.find({ owner: userId }).exec();
    }

    async findById(id: string): Promise<Customer | null> {
        return this.customerModel.findOne({ cusId: id }).exec() || {};

    }
}