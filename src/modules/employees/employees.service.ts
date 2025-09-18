import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import * as bcrypt from 'bcrypt';
import { RoleDocument, Role } from '../auth/schemas/role.schema';

@Injectable()
export class EmployeesService {
  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
  update(id: string, dto: UpdateEmployeeDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 10, status, keyword, tenantId } = query;
    const filter: any = {};

    // Chuyển tenantId string => ObjectId
    if (tenantId) filter.tenantId = new Types.ObjectId(tenantId);

    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (keyword) filter.name = { $regex: keyword, $options: 'i' };

    const total = await this.userModel.countDocuments(filter);
    const users = await this.userModel
      .find(filter)
      .skip((page - 1) * limit)
      .select('-password ')
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    return { total, users };
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Invalid ID');
    const user = await this.userModel.findById(id);

    const userWithRole = await this.userModel
      .findById(id)
      .populate<{ role: RoleDocument }>('role')
      .exec();

    if (!userWithRole)
      throw new UnauthorizedException('Không tìm thấy vai trò');

    const permissions = userWithRole.role || null;
    return permissions;
  }

  async updatePermissions(_id: string, permissions: string[]) {
    // Validate ID
    if (!Types.ObjectId.isValid(_id)) {
      throw new NotFoundException('Invalid role ID');
    }

    // Tìm role theo ID
    const role = await this.roleModel.findById(_id);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Cập nhật permissions
    role.permissions = permissions;

    // Lưu lại
    await role.save();

    return {
      _id: role._id,
      roleName: role.roleName,
      permissions: role.permissions,
    };
  }
}
