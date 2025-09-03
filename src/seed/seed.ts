import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { RoleSeeder } from './role.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const seeder = app.get(RoleSeeder);
  await seeder.seed();

  await app.close();
}
bootstrap();
