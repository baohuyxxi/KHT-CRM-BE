import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskLogDocument = TaskLog & Document;

@Schema({ timestamps: true })
export class TaskLog {
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  taskId: Types.ObjectId;

  @Prop({ required: true })
  userId: string; // nhân viên hoặc sếp

  @Prop({ type: String, default: '' })
  action: string; // ví dụ: "scan CCCD", "upload PDF", "update status"

  @Prop({ type: [String], default: [] })
  attachments?: string[]; // các file được upload trong log
}

export const TaskLogSchema = SchemaFactory.createForClass(TaskLog);
