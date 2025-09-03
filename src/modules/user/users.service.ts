import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  RefreshTokenDocument,
  RefreshToken,
} from '../auth/schemas/refresh-token.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async findById(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .select('-password -refreshTokens');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<User> {
    const updated = await this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .select('-password -refreshTokens');
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    // check old password
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Old password is incorrect');

    // hash new password
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashed;

    // clear all refresh tokens (bắt buộc login lại)
    await this.refreshTokenModel.deleteMany({ userId });

    await user.save();
    return { success: true, message: 'Password changed successfully' };
  }

  // 🔹 Admin lấy toàn bộ user
  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password -refreshTokens');
  }

  // 🔹 Admin update user bất kỳ
  async updateAnyUser(targetUserId: string, dto: UpdateUserDto): Promise<User> {
    const updated = await this.userModel
      .findByIdAndUpdate(targetUserId, dto, { new: true })
      .select('-password -refreshTokens');
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  // 🔹 Admin xóa user
  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new NotFoundException('User not found');
    await this.refreshTokenModel.deleteMany({ userId });
    return { success: true, message: 'User deleted successfully' };
  }
  // 🔹 Admin reset password cho user khác
  async resetPassword(targetUserId: string, newPassword: string) {
    const user = await this.userModel.findById(targetUserId);
    if (!user) throw new NotFoundException('User not found');

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // clear refresh tokens để bắt buộc login lại
    await this.refreshTokenModel.deleteMany({ userId: targetUserId });

    await user.save();
    return { success: true, message: 'Password reset successfully' };
  }
}
