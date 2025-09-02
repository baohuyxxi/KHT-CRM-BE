import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeedModule);
  const seedService = appContext.get(SeedService);

  await seedService.seed(); // chạy hàm seed chính
  await appContext.close();
}

bootstrap().catch((err) => {
  console.error('❌ Seed failed', err);
  process.exit(1);
});
