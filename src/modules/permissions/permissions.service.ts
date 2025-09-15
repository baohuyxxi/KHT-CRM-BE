/* eslint-disable @typescript-eslint/require-await */
// src/modules/permissions/permissions.service.ts
import { Injectable } from '@nestjs/common';
import { Permission } from '../auth/permissions.enum';

@Injectable()
export class PermissionsService {
  async findAll(): Promise<string[]> {
    return Object.values(Permission); // Trả về toàn bộ quyền
  }
}
