import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Counter, Customer, CustomerDocument } from "./schemas/customer.schema";
import { Model } from "mongoose";
import { CreateCustomerDto } from "./dto/add.dto";
import { Order, OrderDocument } from "../orders/schemas/order.schema";


@Injectable()
export class CustomerService {
    constructor(
        @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
        @InjectModel(Counter.name) private counterModel: Model<Counter>,
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
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

    async updateCustomer(id: string, data: Partial<CreateCustomerDto>): Promise<Customer | null> {
        const updated = await this.customerModel
            .findOneAndUpdate({ cusId: id }, data, { new: true })
            .exec();
        if (!updated) {
            throw new NotFoundException(`Customer with id ${id} not found or you do not have permission to update it.`);
        }
        return updated;
    }

    async findAllByUserId(
        userId: string,
        type: string,
        page: number,
        limit: number
    ): Promise<{ data: Customer[]; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        // Đếm tổng số bản ghi
        const total = await this.customerModel.countDocuments({
            owner: userId,
            customerType: type,
        });

        const data = await this.customerModel
            .find({ owner: userId, customerType: type })
            .populate("businesses")
            .populate("orders")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            page,
            totalPages,
        };
    }

    async findById(id: string): Promise<Customer | null> {
        return this.customerModel.findOne({ cusId: id }).populate({ path: 'businesses', select: 'busId name taxId' }).exec() || {};

    }

    async deleteCustomer(id: string): Promise<Customer | null> {
        const deleted = await this.customerModel
            .findOneAndDelete({ cusId: id })
            .exec();
        if (!deleted) {
            throw new NotFoundException(`Customer with id ${id} not found or you do not have permission to delete it.`);
        }
        return deleted;
    }

    async getCounterInvoice(): Promise<string> {
        const seq = await this.counterModel.findById('invoices').exec();

        if (!seq) {
            throw new Error("Không tìm thấy counter invoices");
        }

        return 'HD' + seq.seq.toString().padStart(5, '0');
    }

    async saveInvoice(cusId: string, invoiceId: string, invoiceData: any): Promise<Customer | null> {
        const customer = await this.customerModel.findOne({ cusId }).exec();
        if (!customer) {
            throw new NotFoundException(`Customer with id ${cusId} not found.`);
        }
        customer.invoices?.push(invoiceData);
        const result = await customer.save();
        if (!result) {
            throw new ConflictException(`Failed to save invoice to customer ${cusId}.`);
        } else {
            for (const ordId of invoiceData.ordIds) {
                await this.orderModel.findOneAndUpdate(
                    { ordId },
                    { issued: true },
                    { new: true }
                );
            }
            // increase invoice counter
            await this.counterModel.findByIdAndUpdate(
                'invoices',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
        }
        return result;
    }

    async removeInvoice(cusId: string, invoiceCode: string): Promise<Customer | null> {
        const customer = await this.customerModel.findOne({ cusId }).exec();
        if (!customer) {
            throw new NotFoundException(`Customer with id ${cusId} not found.`);
        }
        customer.invoices = customer.invoices?.filter(inv => inv.invoiceCode !== invoiceCode);
        return customer.save();
    }
}