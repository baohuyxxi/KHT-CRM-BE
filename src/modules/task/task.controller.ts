import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Query,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TaskStatus } from './schemas/task.schema';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Tạo task, ownerId và tenantId lấy từ accessToken
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTask(@Body() createTaskDto: CreateTaskDto, @Request() req: any) {
    const user = req.user;
    const taskData = {
      ...createTaskDto,
      ownerId: user.userId,
      tenantId: user.tenantId,
    };
    return this.taskService.create(taskData);
  }

  // Lấy task mình tạo, có thể filter theo status
  @UseGuards(JwtAuthGuard)
  @Get('created')
  async getCreatedTasks(
    @Request() req: any,
    @Query('status') status?: TaskStatus,
  ) {
    return this.taskService.findCreatedTasks(req.user.userId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/log')
  async performTask(@Param('id') taskId: string, @Request() req: any) {
    const user = req.user;
    return this.taskService.createTaskLog(taskId, user.userId, user.tenantId);
  }
  // Lấy task mình được giao, có thể filter theo status
  @UseGuards(JwtAuthGuard)
  @Get('assigned')
  async getAssignedTasks(
    @Request() req: any,
    @Query('status') status?: TaskStatus,
  ) {
    return this.taskService.findAssignedTasks(req.user.userId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/logs')
  async getTaskLogs(@Param('id') taskLogId: string) {
    return this.taskService.getTaskLogs(taskLogId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('log/:logId')
  async updateTaskLog(
    @Param('logId') logId: string,
    @Body() body: { action?: string; attachments?: string[] },
  ) {
    return this.taskService.updateTaskLog(logId, body);
  }
}
