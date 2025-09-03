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
import { JwtService } from '@nestjs/jwt';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { DeleteResult } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
      await this.refreshTokenModel.create({
        userId: user._id,
        token: refreshToken,
        expiresAt,
      });
      await user.save();

      // Loại bỏ password khỏi user
      const { password: _, ...safeUser } = user.toObject();
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
      let payload: any;

      try {
        payload = jwt.verify(refreshToken, secret);
      } catch {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Kiểm tra token có trong DB không
      const tokenDoc = await this.refreshTokenModel.findOne({
        token: refreshToken,
      });
      if (!tokenDoc)
        throw new UnauthorizedException('Refresh token not found or expired');

      const newAccessToken = jwt.sign(
        { sub: payload.sub, tenantId: payload.tenantId, role: payload.role },
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
  async logout(refreshToken: string) {
    await this.refreshTokenModel.deleteOne({ token: refreshToken });
    return { success: true, message: 'Logged out successfully' };
  }

  async logoutAll(userId: string, keepRefreshToken?: string): Promise<number> {
    let result: DeleteResult;
    if (keepRefreshToken) {
      // Xoá tất cả trừ token hiện tại
      result = await this.refreshTokenModel.deleteMany({
        userId,
        token: { $ne: keepRefreshToken },
      });
    } else {
      // Xoá toàn bộ refreshToken của user
      result = await this.refreshTokenModel.deleteMany({ userId });
    }

    return result.deletedCount || 0; // chỉ trả số lượng token đã xoá
  }
}
