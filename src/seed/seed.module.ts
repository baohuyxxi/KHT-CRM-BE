// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import appConfig from '../config/environment.config';
import { Role, RoleSchema } from 'src/modules/auth/schemas/role.schema';
import { User, UserSchema } from 'src/modules/auth/schemas/user.schema';

import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('app.MONGODB_URI'),
        dbName: config.get<string>('app.DATABASE_NAME'),
      }),
    }),
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [RoleSeeder, UserSeeder],
  exports: [RoleSeeder, UserSeeder],
})
export class SeedModule {}
