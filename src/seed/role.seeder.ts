import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from 'src/modules/auth/schemas/role.schema';

@Injectable()
export class RoleSeeder {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async seed() {
    // 🔹 check role admin đã có chưa
    const exist = await this.roleModel.findOne({ roleName: 'admin' });
    if (!exist) {
      await this.roleModel.create({
        roleName: 'admin',
        permissions: [
          'user:read:any',
          'user:create:any',
          'user:read:own',
          'user:update:any',
          'user:update:own',
          'customer:read:any',
          'customer:read:own',
          'customer:create',
          'customer:update:any',
          'customer:update:own',
          'customer:delete:any',
          'customer:delete:own',
          'task:read:any',
          'task:read:own',
          'task:create',
          'task:update:any',
          'task:update:own',
          'task:delete:any',
          'task:delete:own',
        ],
        tenantId: new Types.ObjectId('68b4124594d64e168a40fc99'), // 🔹 gắn tenant mặc định
      });

      console.log('✅ Created admin role');
    } else {
      console.log('ℹ️ Admin role already exists');
    }
  }
}
