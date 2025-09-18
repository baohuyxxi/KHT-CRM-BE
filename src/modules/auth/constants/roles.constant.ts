// src/modules/auth/constants/roles.constant.ts
export const DefaultRoles = {
  user: {
    name: 'Nhân viên',
    permissions: [
      'auth:login',
      // Employee (user thường chỉ xem/sửa được bản thân)
      'employee:read:own',
      'employee:update:own',

      // Customer
      'customer:read:own',
      'customer:update:own',

      // Business
      'business:read:own',
      'business:update:own',

      // Order
      'order:read:own',
      'order:update:own',
      'order:create',
      'order:delete:own',

      // Task
      'task:read:own',
      'task:update:own',
      'task:create',
      'task:delete:own',
    ],
  },
  admin: {
    name: 'admin',
    permissions: [
      'auth:login',
      // Employee
      'employee:read:any',
      'employee:update:any',
      'employee:create:any',
      'employee:role',

      // Customer
      'customer:read:any',
      'customer:update:any',
      'customer:create',
      'customer:delete:any',

      // Business
      'business:read:any',
      'business:update:any',
      'business:create',
      'business:delete:any',

      // Order
      'order:read:any',
      'order:update:any',
      'order:delete:any',
      'order:create',

      // Task
      'task:read:any',
      'task:update:any',
      'task:create',
      'task:delete:any',
    ],
  },
};
