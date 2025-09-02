import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TenantDocument = Tenant & Document;

@Schema({ timestamps: true, collection: 'tenants' })
export class Tenant {
  @Prop({ type: String, required: true, unique: true })
  name: string; // Tên công ty / tenant

  @Prop({ type: String, required: true, unique: true })
  code: string; // Mã tenant (ví dụ: KIMHONGTHINH)

  @Prop({ type: String })
  address?: string;

  @Prop({ type: String })
  contactEmail?: string;

  @Prop({ type: String })
  contactPhone?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
