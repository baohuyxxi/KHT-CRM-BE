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
}
