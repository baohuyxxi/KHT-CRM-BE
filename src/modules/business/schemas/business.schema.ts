import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Counter } from 'src/modules/customer/schemas/customer.schema';

export type BusinessDocument = Business & Document;

export enum BusinessType {
    ORGANIZATION = 'TC',
    HOUSEHOLD = 'HKD',
}

@Schema({ timestamps: true, collection: 'businesses' })
export class Business {
    @Prop({ type: String, unique: true })
    busId: string; // Mã DN (BUS0000001)

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String })
    address?: string;

    @Prop({ type: String })
    phone?: string;

    @Prop({ type: String })
    email?: string;

    @Prop({ type: String })
    owner?: string;

    @Prop({ type: String })
    type?: BusinessType;

    @Prop({ type: String })
    taxId?: string; // MST

    @Prop({ type: String })
    licenseCode?: string;

    @Prop({ type: String })
    licenseFile?: string; // đường dẫn file PDF

    @Prop({ type: Date })
    startDate?: Date;

    @Prop({ type: String })
    representativeId?: string; // CCCD người đại diện

    @Prop({ type: String })
    representativeName?: string;

    @Prop({ type: Boolean, default: true })
    active: boolean;

    // Liên kết ngược tới Customer
    @Prop({ type: String })
    cusId: string; // lưu cusId của Customer
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
BusinessSchema.virtual('cusInfo', {
    ref: 'Customer',          // model Customer
    localField: 'cusId', // field trong Business
    foreignField: 'cusId',    // field Customer để match
    justOne: true,
});

BusinessSchema.set('toObject', { virtuals: true });
BusinessSchema.set('toJSON', { virtuals: true });

BusinessSchema.virtual('ownerInfo', {
    ref: 'User',              // model User
    localField: 'owner',      // field trong Business
    foreignField: 'userId',      // field User để match
    justOne: true,            // 1 business chỉ có 1 user
});
BusinessSchema.set('toObject', { virtuals: true });
BusinessSchema.set('toJSON', { virtuals: true });


BusinessSchema.post<BusinessDocument>('save', async function (doc, next) {
    try {
        if (doc.isNew && !doc.busId) {
            const counterModel = this.db.model<Counter & Document>('Counter');

            const counter = await counterModel.findByIdAndUpdate(
                { _id: 'businesses' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );

            const seqNumber = counter.seq;
            doc.busId = 'DN' + seqNumber.toString().padStart(7, '0');
            await doc.updateOne({ busId: doc.busId });
        }
        next();
    } catch (err) {
        next(err);
    }
});

