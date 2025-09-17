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
  @Prop({ type: String, unique: true })
  cusId: string; // Mã KH (CUS0000001)

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: String, index: true })
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

  @Prop({ type: String, enum: CustomerType, required: true })
  customerType: CustomerType;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

@Schema({ collection: 'counters' })
export class Counter {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number, default: 0 })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

CustomerSchema.post<CustomerDocument>('save', async function (doc, next) {
  try {
    if (doc.isNew && !doc.cusId) {
      const counterModel = this.db.model<Counter & Document>('Counter');

      const counter = await counterModel.findByIdAndUpdate(
        { _id: 'customers' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );

      const seqNumber = counter.seq;
      doc.cusId = 'KH' + seqNumber.toString().padStart(7, '0');
      await doc.updateOne({ cusId: doc.cusId });
    }
    next();
  } catch (err) {
    next(err);
  }
});
