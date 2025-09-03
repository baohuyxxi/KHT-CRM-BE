import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import env from './config/environment.config';
import databaseConfig from './config/database.config';
import { DatabaseService } from './config/database.service';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { TestController } from './modules/Test/test.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env, databaseConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('database.uri');
        const dbName = configService.get<string>('database.name');

        console.log('Connected to MongoDB ✅');

        return { uri, dbName };
      },
    }),
    AuthModule,
    TenantModule,
    CloudinaryModule,
  ],
  controllers: [TestController],
  providers: [DatabaseService],
})
export class AppModule {}
