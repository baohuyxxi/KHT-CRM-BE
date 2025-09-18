import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
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
import { RoleDocument, Role } from './schemas/role.schema';
import { DefaultRoles } from './constants/roles.constant';
import { Permission } from '../auth/permissions.enum';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const tenantId = new Types.ObjectId(dto.tenantId);

    const exist = await this.userModel.findOne({ email: dto.email, tenantId });
    if (exist) throw new ConflictException('Người dùng đã tồn tại');

    const defaultRole = DefaultRoles.user;
    const userRole = await this.roleModel.create({
      roleName: defaultRole.name,
      permissions: defaultRole.permissions,
      tenantId,
    });

    const user = new this.userModel({
      tenantId,
      email: dto.email,
      password: dto.password,
      name: dto.name,
      role: userRole._id,
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
      if (!user) throw new UnauthorizedException('Không tìm thấy người dùng');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Mật khẩu không đúng');

      const userWithRole = await this.userModel
        .findOne({ userId: user.userId })
        .populate<{ role: RoleDocument }>('role')
        .exec();
      if (!userWithRole)
        throw new UnauthorizedException('Không tìm thấy vai trò');

      const permissions = userWithRole.role?.permissions || [];

      // ✅ Check quyền đăng nhập
      if (!permissions.includes(Permission.AUTH_LOGIN)) {
        throw new ForbiddenException('Bạn không có quyền đăng nhập');
      }

      const payload = {
        userId: user.userId,
        tenantId: user.tenantId,
        role: userWithRole.role?.roleName,
        permissions,
      };

      const secret = this.configService.get<string>('app.JWT_SECRET');
      if (!secret)
        throw new UnauthorizedException('JWT_Secret không được định nghĩa');

      const accessToken = jwt.sign(payload, secret, { expiresIn: '1d' });
      const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await this.refreshTokenModel.create({
        userId: user.userId,
        token: refreshToken,
        expiresAt,
      });

      const { password: _, role, ...safeUser } = user.toObject();
      return {
        accessToken,
        refreshToken,
        user: {
          ...safeUser,
          role: userWithRole.role?.roleName,
          permissions,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException(error.message || 'Lỗi xác thực');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const secret = this.configService.get<string>('app.JWT_SECRET');
      if (!secret) throw new Error('JWT_Secret không được định nghĩa');
      let payload: any;

      try {
        payload = jwt.verify(refreshToken, secret);
      } catch {
        throw new UnauthorizedException(
          'Refresh token không hợp lệ hoặc đã hết hạn',
        );
      }

      // Kiểm tra token có trong DB không
      const tokenDoc = await this.refreshTokenModel.findOne({
        token: refreshToken,
      });
      if (!tokenDoc)
        throw new UnauthorizedException(
          'Refresh token không tồn tại hoặc đã hết hạn',
        );

      const newAccessToken = jwt.sign(
        {
          userId: payload.userId,
          tenantId: payload.tenantId,
          role: payload.role,
        },
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
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }
  async logout(refreshToken: string) {
    await this.refreshTokenModel.deleteOne({ token: refreshToken });
    return { success: true, message: 'Đăng xuất thành công' };
  }

  async logoutAll(userId: string, keepRefreshToken?: string): Promise<number> {
    const userObjectId = new Types.ObjectId(userId);
    let result: DeleteResult;

    if (keepRefreshToken) {
      result = await this.refreshTokenModel.deleteMany({
        userId: userObjectId,
        token: { $ne: keepRefreshToken },
      });
    } else {
      // Xoá toàn bộ refreshToken của user
      result = await this.refreshTokenModel.deleteMany({
        userId: userObjectId,
      });
    }
    return result.deletedCount || 0; // chỉ trả số lượng token đã xoá
  }
}
