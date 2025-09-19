import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
    @Prop({ type: String, unique: true })
    ordId: string; // Mã đơn hàng (ORD0000001)

    @Prop({ type: String, required: true, enum: ['Đấu mới', 'Gia hạn/Mua thêm'] })
    reqType: string;

    @Prop({ type: String, enum: ['SP', 'DV'], required: true })
    type: string; // Loại: SP (sản phẩm), DV (dịch vụ)

    @Prop({ type: String })
    name: string; // Tên đơn hàng / sản phẩm / dịch vụ

    @Prop({ type: String, required: true })
    cusId: string; // Mã khách hàng (mapping sang Customer.cusId)

    @Prop({ type: String })
    cusCitizenId: string; // CCCD khách hàng

    @Prop({ type: String })
    cusName: string; // Tên khách hàng

    @Prop({ type: String })
    busId: string; // Mã doanh nghiệp (mapping sang Business.busId)

    @Prop({ type: String })
    busTaxId: string; // Mã số thuế doanh nghiệp

    @Prop({ type: String })
    busName: string; // Tên doanh nghiệp

    @Prop({ type: Date })
    registerDate?: Date; // Ngày đăng ký

    @Prop({ type: Date })
    startDate?: Date; // Ngày bắt đầu

    @Prop({ type: String })
    guarantee?: string; // Thời gian bảo hành (ví dụ: 12 tháng)

    @Prop({ type: String })
    expire?: string; //số tháng của sản phẩm

    @Prop({ type: Date })
    expectedEnd?: Date; // Dự kiến kết thúc sản phẩm

    @Prop({ type: Number })
    price?: number; // Giá trị hợp đồng

    @Prop({ type: String, enum: ['Chưa thanh toán', 'Đã thanh toán', 'Thanh toán 1 phần'], default: 'Chưa thanh toán' })
    paymentStatus: string;

    @Prop({ type: Number, default: 0 })
    paid?: number; // Đã thanh toán

    @Prop({ type: String, enum: ['Mới', 'Đang xử lý', 'Hoàn thành', 'Hủy'], default: 'Mới' })
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

//
// Counter Schema (dùng chung với Customer)
//
@Schema({ collection: 'counters' })
export class Counter {
    @Prop({ type: String, required: true })
    _id: string;

    @Prop({ type: Number, default: 0 })
    seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

//
// Middleware tự sinh orderId giống cusId
//
OrderSchema.post<OrderDocument>('save', async function (doc, next) {
    try {
        if (doc.isNew && !doc.ordId) {
            const counterModel = this.db.model<Counter & Document>('Counter');
            const counter = await counterModel.findByIdAndUpdate(
                { _id: 'orders' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true },
            );

            const seqNumber = counter.seq;
            doc.ordId = 'DH' + seqNumber.toString().padStart(7, '0');
            await doc.updateOne({ orderId: doc.ordId });
        }
        next();
    } catch (err) {
        next(err);
    }
});
