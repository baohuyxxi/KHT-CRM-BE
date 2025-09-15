// src/seed/user.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role, RoleDocument } from 'src/modules/auth/schemas/role.schema';
import { User, UserDocument } from 'src/modules/auth/schemas/user.schema';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {}

  async seed() {
    const adminRole = await this.roleModel.findOne({ name: 'admin' });
    if (!adminRole) {
      throw new Error('Role admin chưa tồn tại. Hãy chạy RoleSeeder trước.');
    }

    const exist = await this.userModel.findOne({ email: 'admin@demo.com' });
    if (!exist) {
      const password = await bcrypt.hash('123456', 10); // default pass

      await this.userModel.create({
        email: 'admin@demo.com',
        name: 'Admin',
        password,
        role: adminRole._id,
        isActive: true,
        tenantId: '68b4124594d64e168a40fc99',
      });

      console.log('Created admin user: admin@demo.com / 123456');
    } else {
      console.log('Admin user already exists');
    }
  }
}
