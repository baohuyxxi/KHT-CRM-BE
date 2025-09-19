import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskType } from '../dto/create-task.dto';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  PENDING = 'pending', // mới tạo
  IN_PROGRESS = 'in_progress', // đang làm
  COMPLETED = 'completed', // hoàn tất
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  ownerId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Tenant' })
  tenantId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: String, enum: Object.values(TaskType) })
  type: TaskType;

  @Prop()
  details?: string;

  @Prop({ type: [String], default: [] })
  images?: string[];

  @Prop({ type: [String], default: [] })
  pdfs?: string[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  assigneeIds?: string[];

  @Prop({
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @Prop({ type: [Types.ObjectId], ref: 'TaskLog', default: [] })
  logs?: Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
