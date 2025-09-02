// Định nghĩa permission chung cho toàn hệ thống (module-level PBAC)

export enum Permission {
  // User module
  USER_READ_ANY = 'user:read:any',
  USER_READ_OWN = 'user:read:own',
  USER_UPDATE_ANY = 'user:update:any',
  USER_UPDATE_OWN = 'user:update:own',

  // Customer module
  CUSTOMER_READ_ANY = 'customer:read:any',
  CUSTOMER_READ_OWN = 'customer:read:own',
  CUSTOMER_CREATE = 'customer:create',
  CUSTOMER_UPDATE_ANY = 'customer:update:any',
  CUSTOMER_UPDATE_OWN = 'customer:update:own',
  CUSTOMER_DELETE_ANY = 'customer:delete:any',
  CUSTOMER_DELETE_OWN = 'customer:delete:own',
}
