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
            .findOneAndUpdate({ ordId: id }, data, { new: true })
            .exec();

        if (!updated) {
            throw new NotFoundException(
                `Order with id ${id} not found or you do not have permission to update it.`,
            );
        }
        return updated;
    }

    async findAllByUserId(userId: string, type: string, limit: number, page: number): Promise<{ data: Order[]; totalPages: number; page: number; }> {
        const orders = await this.orderModel
            .find({ type })
            .limit(limit)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .exec();
        return {
            data: orders,
            page,
            totalPages: Math.ceil(await this.orderModel.countDocuments({ type }) / limit)
        }
    }

    async findAll(): Promise<Order[]> {
        return this.orderModel
            .find()
            .exec();
    }

    async findById(id: string): Promise<Order | null> {
        return (
            (await this.orderModel
                .findOne({ ordId: id })
                .exec()) || null
        );
    }

    async extendOrder(id: string, data: any): Promise<Order | null> {
        await this.orderModel
            .findOneAndUpdate({ ordId: id }, { extend: true }, { new: true })
            .exec();
        return await this.createOrder(data);
    }

    async getOrderOfCustomer(cusId: string, limit: number, page: number): Promise<{ data: Order[]; page: number; totalPages: number }> {
        const [result, total] = await Promise.all([
            this.orderModel.find({ cusId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).exec(),
            this.orderModel.countDocuments({ cusId }).exec()
        ]);
        return {
            data: result,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async filterOrders(
        type: string,
        search: string,
        name: string,
        reqType: string,
        startDate: Date,
        endDate: Date,
        paymentStatus: string,
        status: string,
        limit: number,
        page: number
    ): Promise<{ data: Order[]; page: number; totalPages: number }> {
        const query: any = {};

        // ✅ Search nhiều field
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [
                { ordId: regex },
                { busName: regex },
                { cusName: regex },
                { busId: regex },
                { cusId: regex },
                { cusCitizenId: regex },
                { busTaxId: regex },
            ];
        }

        // ✅ Lọc theo khoảng ngày (registerDate)
        if (startDate || endDate) {
            query.registerDate = {};
            if (startDate) query.registerDate.$gte = startDate;
            if (endDate) query.registerDate.$lte = endDate;
        }

        // ✅ Loại khách hàng
        if (type) {
            query.type = type;
        }

        // ✅ Loại đơn hàng
        if (reqType) {
            query.reqType = reqType;
        }

        // ✅ Tìm theo name (regex)
        if (name) {
            query.name = new RegExp(name, "i");
        }

        // ✅ Thanh toán
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        // ✅ Trạng thái đơn hàng
        if (status) {
            query.status = status;
        }

        // 🔥 Pagination
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.orderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.orderModel.countDocuments(query).exec(),
        ]);

        return {
            data,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async deleteOrder(id: string): Promise<void> {
        await this.orderModel.deleteOne({ ordId: id }).exec();
    }

    async markOrderAsIssued(id: string): Promise<Order | null> {
        const updated = await this.orderModel
            .findOneAndUpdate({ ordId: id }, { issued: true }, { new: true })
            .exec();

        if (!updated) {
            throw new NotFoundException(
                `Order with id ${id} not found or you do not have permission to update it.`,
            );
        }
        return updated;
    }
}