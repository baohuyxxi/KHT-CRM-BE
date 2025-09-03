import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleSeeder } from './role.seeder';
import appConfig from '../config/environment.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Role, RoleSchema } from 'src/modules/auth/schemas/role.schema';

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
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [RoleSeeder],
  exports: [RoleSeeder],
})
export class SeedModule {}
