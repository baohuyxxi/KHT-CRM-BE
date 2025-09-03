import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../modules/auth/schemas/role.schema';
import { Permission } from '../modules/auth/permissions.enum';

@Injectable()
export class RoleSeeder {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async seed() {
    const roles = [
      {
        name: 'admin',
        permissions: Object.values(Permission), // full quyền
      },
      {
        name: 'user',
        permissions: [
          Permission.USER_READ_OWN,
          Permission.USER_UPDATE_OWN,
          Permission.CUSTOMER_READ_OWN,
          Permission.CUSTOMER_UPDATE_OWN,
        ],
      },
    ];

    for (const role of roles) {
      const exist = await this.roleModel.findOne({ name: role.name });
      if (!exist) {
        await this.roleModel.create(role);
        console.log(`Created role: ${role.name}`);
      } else {
        console.log(`Role ${role.name} already exists`);
      }
    }
  }
}
