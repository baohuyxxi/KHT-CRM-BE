import { SetMetadata } from '@nestjs/common';
import { RESOURCE_PERMISSION_KEY } from './resource.guard';

export const ResourcePermission = (permission: 'viewer' | 'editor' | 'owner') =>
  SetMetadata(RESOURCE_PERMISSION_KEY, permission);
