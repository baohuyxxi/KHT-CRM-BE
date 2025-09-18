// src/modules/auth/permissions.enum.ts
export enum Permission {
  // Auth
  AUTH_LOGIN = 'auth:login',

  // Employee (nhân sự)
  EMPLOYEE_READ_ANY = 'employee:read:any',
  EMPLOYEE_READ_OWN = 'employee:read:own',
  EMPLOYEE_CREATE = 'employee:create:any',
  EMPLOYEE_UPDATE_ANY = 'employee:update:any',
  EMPLOYEE_UPDATE_OWN = 'employee:update:own',
  EMPLOYEE_ROLE = 'employee:role',

  // Customer
  CUSTOMER_READ_ANY = 'customer:read:any',
  CUSTOMER_READ_OWN = 'customer:read:own',
  CUSTOMER_CREATE = 'customer:create',
  CUSTOMER_UPDATE_ANY = 'customer:update:any',
  CUSTOMER_UPDATE_OWN = 'customer:update:own',
  CUSTOMER_DELETE_ANY = 'customer:delete:any',
  CUSTOMER_DELETE_OWN = 'customer:delete:own',

  // Business
  BUSINESS_READ_ANY = 'business:read:any',
  BUSINESS_READ_OWN = 'business:read:own',
  BUSINESS_CREATE = 'business:create',
  BUSINESS_UPDATE_ANY = 'business:update:any',
  BUSINESS_UPDATE_OWN = 'business:update:own',
  BUSINESS_DELETE_ANY = 'business:delete:any',
  BUSINESS_DELETE_OWN = 'business:delete:own',

  // Order
  ORDER_READ_ANY = 'order:read:any',
  ORDER_READ_OWN = 'order:read:own',
  ORDER_CREATE = 'order:create',
  ORDER_UPDATE_ANY = 'order:update:any',
  ORDER_UPDATE_OWN = 'order:update:own',
  ORDER_DELETE_ANY = 'order:delete:any',
  ORDER_DELETE_OWN = 'order:delete:own',

  // Task
  TASK_READ_ANY = 'task:read:any',
  TASK_READ_OWN = 'task:read:own',
  TASK_CREATE = 'task:create',
  TASK_UPDATE_ANY = 'task:update:any',
  TASK_UPDATE_OWN = 'task:update:own',
  TASK_DELETE_ANY = 'task:delete:any',
  TASK_DELETE_OWN = 'task:delete:own',
}
