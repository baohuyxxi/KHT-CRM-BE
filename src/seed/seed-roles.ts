// src/seed/seed-roles.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from '../modules/auth/schemas/role.schema';
import { DefaultRoles } from '../modules/auth/constants/roles.constant';

@Injectable()
export class UpdateRoles {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {}

  async seed() {
    for (const key of Object.keys(DefaultRoles)) {
      const roleData = DefaultRoles[key];

      await this.roleModel.updateOne(
        { roleName: roleData.name },
        { $set: { permissions: roleData.permissions } },
        { upsert: true },
      );

      console.log(`✅ Role "${roleData.name}" đã seed/update thành công`);
    }
  }
}
