import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  // TTL field: MongoDB sẽ tự xoá document khi hết hạn
  @Prop({ required: true })
  expiresAt: Date;
}

export type RefreshTokenDocument = RefreshToken & Document;
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

// ⚡ TTL Index: expiresAt < now → MongoDB auto delete
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
