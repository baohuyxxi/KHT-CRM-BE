import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ unique: true, index: true }) // ❌ Không required, chỉ unique
  userId: string; // VD: USR00001

  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', required: true })
  role: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<UserDocument>('save', async function (next) {
  // Tự động sinh userId
  if (!this.userId) {
    const lastUser = await this.collection
      .find({})
      .sort({ userId: -1 })
      .limit(1)
      .toArray();

    let nextNumber = 1;
    if (lastUser.length > 0) {
      const lastId = lastUser[0].userId; // VD: USR00005
      const num = parseInt(lastId.replace('USR', ''), 10);
      nextNumber = num + 1;
    }
    this.userId = `USR${nextNumber.toString().padStart(5, '0')}`;
  }

  // Hash password nếu thay đổi
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});
