import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  DATABASE_NAME: process.env.DATABASE_NAME || 'CRM-KimHongThinh',
  APP_HOST: process.env.APP_HOST || 'localhost',
  APP_PORT: parseInt(process.env.APP_PORT || '3000', 10),
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  AUTHOR: process.env.AUTHOR || 'Unknown',
  NODE_ENV: process.env.NODE_ENV || 'production',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret',
}));
