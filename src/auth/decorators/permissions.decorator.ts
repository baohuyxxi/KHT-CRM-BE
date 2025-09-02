import { SetMetadata } from '@nestjs/common';
import { Permission } from '../permissions.enum';

// Key lưu metadata
export const PERMISSIONS_KEY = 'permissions';

// Decorator gắn permission cho route
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
