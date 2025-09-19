import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskLog, TaskLogSchema } from './schemas/task-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: TaskLog.name, schema: TaskLogSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
