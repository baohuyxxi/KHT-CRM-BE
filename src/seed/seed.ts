// src/seed/seed.ts
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';
import { UpdateRoles } from './seed-roles';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  // const roleSeeder = app.get(RoleSeeder);
  // const userSeeder = app.get(UserSeeder);

  // await roleSeeder.seed();
  // // await userSeeder.seed();

  const updateRoles = app.get(UpdateRoles);
  await updateRoles.seed();
  await app.close();
}
bootstrap();
