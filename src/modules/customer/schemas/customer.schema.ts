import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CustomerDocument = Customer & Document;

export enum CustomerType {
    MARKET = 'Thị trường',
    POTENTIAL = 'Tiềm năng',
    EXISTING = 'Đã là khách hàng',
}

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
    @Prop({ type: String, required: true, unique: true })
    customerCode: string; // Mã KH (CUS0000001)

    @Prop({ type: String, required: true })
    owner: string;

    @Prop({ type: String, required: true, unique: true })
    citizenId: string; // CCCD

    @Prop({ type: String })
    firstName?: string;

    @Prop({ type: String })
    lastName?: string;

    @Prop({ type: Date })
    dob?: Date;

    @Prop({ type: String, enum: ['Nam', 'Nữ', 'Khác'] })
    gender?: string;

    @Prop({ type: String })
    address?: string;

    @Prop({ type: String, match: /^[0-9]{10,11}$/ })
    phone?: string;

    @Prop({ type: String, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })
    email?: string;

    @Prop({ type: Boolean, default: true })
    active: boolean;

    @Prop({ type: String, enum: Object.values(CustomerType), required: true })
    customerType: CustomerType;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ type: Date })
    createdAt?: Date;

    @Prop({ type: Date })
    updatedAt?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

@Schema({ collection: 'counters' })
export class Counter {
    @Prop({ type: String, required: true, unique: true })
    _id: string;

    @Prop({ type: Number, default: 0 })
    seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

CustomerSchema.pre<CustomerDocument>('save', async function (next) {
    if (this.isNew && !this.customerCode) {
        const counterModel = this.db.model<Counter & Document>('Counter');

        const counter = await counterModel.findByIdAndUpdate(
            { _id: 'customer' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const seqNumber = counter.seq;
        this.customerCode = 'KH' + seqNumber.toString().padStart(7, '0');
    }
    next();
});
