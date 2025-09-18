import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, Counter } from './schemas/order.schema';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Counter.name) private counterModel: Model<Counter>,
    ) { }

    async createOrder(data: CreateOrderDto): Promise<Order> {
        const session = await this.orderModel.db.startSession();
        session.startTransaction();

        try {
            const counter = await this.counterModel.findByIdAndUpdate(
                'orders',
                { $inc: { seq: 1 } },
                { new: true, upsert: true, session },
            );

            const ordId = 'DH' + counter.seq.toString().padStart(7, '0');
            const newOrder = new this.orderModel({ ...data, ordId });

            await newOrder.save({ session });
            await session.commitTransaction();

            return newOrder;
        } catch (err) {
            await session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
    }

    async updateOrder(
        id: string,
        data: Partial<CreateOrderDto>,
    ): Promise<Order | null> {
        const updated = await this.orderModel
            .findOneAndUpdate({ orderId: id }, data, { new: true })
            .exec();

        if (!updated) {
            throw new NotFoundException(
                `Order with id ${id} not found or you do not have permission to update it.`,
            );
        }
        return updated;
    }

    async findAllByUserId(userId: string): Promise<Order[]> {
        return this.orderModel
            .find({ owner: userId })
            .exec();
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel
            .find()
            .exec();
    }

    async findById(id: string): Promise<Order | null> {
        return (
            (await this.orderModel
                .findOne({ orderId: id })
                .populate([
                    { path: 'customer', select: 'cusId cusName citizenId' },
                    { path: 'business', select: 'busId name taxId' },
                ])
                .exec()) || null
        );
    }
}
