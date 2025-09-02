import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config'; // ✅ import ConfigService
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly configService: ConfigService, // ✅ inject
  ) {}

  async register(dto: RegisterDto) {
    const tenantId = new Types.ObjectId(dto.tenantId);

    const exist = await this.userModel.findOne({ email: dto.email, tenantId });
    if (exist) throw new ConflictException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      tenantId,
      email: dto.email,
      password: hashed,
      name: dto.name,
      role: UserRole.USER,
      isActive: true,
      permissions: [],
    });
    const saved = await user.save();

    const { password, ...safeUser } = saved.toObject();
    return safeUser;
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) throw new UnauthorizedException('Invalid credentials');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');
      const payload = {
        sub: user._id,
        tenantId: user.tenantId,
        role: user.role,
        permissions: user.permissions || [],
      };
      const secret = this.configService.get<string>('app.JWT_SECRET');
      if (!secret) throw new Error('JWT_SECRET is not defined');

      // Generate tokens
      const accessToken = jwt.sign(payload, secret, { expiresIn: '1d' });
      const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
      user.refreshTokens.push(refreshToken);
      await user.save();

      // Loại bỏ password và refreshToken khỏi user
      const { password: _, refreshTokens: __, ...safeUser } = user.toObject();
      return {
        accessToken,
        refreshToken,
        user: safeUser,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  // src/auth/auth.service.ts
  async refresh(refreshToken: string) {
    try {
      const secret = this.configService.get<string>('app.JWT_SECRET');
      if (!secret) throw new Error('JWT_SECRET is not defined');
      // Verify refreshToken
      const payload = jwt.verify(refreshToken, secret) as any;

      // Tìm user trong DB
      const user = await this.userModel.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      // Kiểm tra refreshToken có hợp lệ không
      if (!user.refreshTokens.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Tạo accessToken mới
      const newAccessToken = jwt.sign(
        { sub: user._id, tenantId: user.tenantId, role: user.role },
        secret,
        { expiresIn: '1d' },
      );

      return { accessToken: newAccessToken };
    } catch (error) {
      // Nếu hết hạn thì xoá token trong DB
      if (error.name === 'TokenExpiredError') {
        const decoded: any = jwt.decode(refreshToken);
        if (decoded?.sub) {
          await this.userModel.updateOne(
            { _id: decoded.sub },
            { $pull: { refreshTokens: refreshToken } },
          );
        }
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  async logout(userId: string, refreshToken: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken,
    );
    await user.save();

    return { success: true, message: 'Logged out successfully' };
  }

  async logoutAll(userId: string, refreshToken?: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    user.refreshTokens = refreshToken ? [refreshToken] : [];
    await user.save();

    return { success: true, message: 'Logged out from all devices' };
  }
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new BadRequestException('Old password is incorrect');

    // Hash mật khẩu mới
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // Option: clear tất cả refreshTokens để buộc login lại
    user.refreshTokens = [];

    await user.save();
    return { success: true, message: 'Password changed successfully' };
  }
}
