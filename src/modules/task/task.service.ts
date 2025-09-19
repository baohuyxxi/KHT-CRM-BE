import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { TaskLog, TaskLogDocument } from './schemas/task-log.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { Types } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(TaskLog.name) private taskLogModel: Model<TaskLogDocument>,
  ) {}

  async create(
    taskData: CreateTaskDto & { ownerId: string; tenantId: string },
  ): Promise<Task> {
    const createdTask = new this.taskModel(taskData);
    return createdTask.save();
  }

  async findCreatedTasks(userId: string, status?: TaskStatus): Promise<Task[]> {
    const filter: any = { ownerId: userId };
    if (status) filter.status = status;
    return this.taskModel.find(filter).exec();
  }

  async findAssignedTasks(
    userId: string,
    status?: TaskStatus,
  ): Promise<Task[]> {
    const filter: any = { assigneeIds: userId };
    if (status) filter.status = status;
    return this.taskModel.find(filter).exec();
  }

  async createTaskLog(
    taskId: string,
    userId: string,
    tenantId: string,
    // action: string,
    // attachments?: string[],
  ): Promise<TaskLog> {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const log = new this.taskLogModel({ taskId, userId, tenantId });
    const savedLog = await log.save();
    // push log vào task.logs
    task.logs = task.logs || [];
    task.logs.push(savedLog._id as Types.ObjectId);
    await task.save();

    return savedLog;
  }

  async getTaskLogs(taskLogId: string): Promise<{ task: Task; log: TaskLog }> {
    // Lấy log theo id
    const log = await this.taskLogModel.findById(taskLogId);
    if (!log) throw new NotFoundException('TaskLog not found');

    // Lấy task tương ứng
    const task = await this.taskModel.findById(log.taskId);
    if (!task) throw new NotFoundException('Task not found');

    return { task, log };
  }

  async updateTaskLog(
    logId: string,
    updateData: Partial<TaskLog>,
  ): Promise<TaskLog> {
    const log = await this.taskLogModel.findByIdAndUpdate(logId, updateData, {
      new: true,
    });
    if (!log) throw new NotFoundException('TaskLog not found');
    return log;
  }
}
