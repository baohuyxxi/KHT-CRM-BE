import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Share {
  @Prop({ type: Types.ObjectId, ref: 'Resource', required: true })
  resourceId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sharedWith: Types.ObjectId;

  @Prop({ required: true, enum: ['viewer', 'editor', 'owner'] })
  permission: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export type ShareDocument = Share & Document;
export const ShareSchema = SchemaFactory.createForClass(Share);
