import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantModule } from 'src/modules/tenant/tenant.module';
import { SeedService } from './seed.service';
import appConfig from '../config/environment.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    TenantModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
