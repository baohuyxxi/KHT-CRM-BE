// src/seed/user.seeder.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    // 🔹 tìm role admin
    const adminRole = await this.roleModel.findOne({ name: 'admin' });
    if (!adminRole) {
      throw new Error('Role admin chưa tồn tại. Hãy chạy RoleSeeder trước.');
    }

    // 🔹 check user admin đã tồn tại chưa
    const exist = await this.userModel.findOne({ email: 'admin@demo.com' });
    if (!exist) {
      const password = await bcrypt.hash('123456', 10); // default pass

      await this.userModel.create({
        email: 'admin@demo.com',
        name: 'Admin',
        password,
        role: adminRole._id,
        isActive: true,
        tenantId: new Types.ObjectId('68b4124594d64e168a40fc99'), // ObjectId tenant
        // Nếu cần userId riêng gọn: tự generate ở đây
        userId: await this.generateUserId(),
      });

      console.log('✅ Created admin user: admin@demo.com / 123456');
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  }

  // 🔹 Hàm sinh userId dạng USR00001, USR00002
  private async generateUserId(): Promise<string> {
    const lastUser = await this.userModel
      .findOne()
      .sort({ createdAt: -1 })
      .select('userId')
      .exec();

    if (!lastUser || !lastUser.userId) {
      return 'USR00001';
    }

    const lastId = parseInt(lastUser.userId.replace('USR', ''), 10);
    const newId = lastId + 1;
    return 'USR' + newId.toString().padStart(5, '0');
  }
}
