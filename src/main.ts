import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  process.env.TZ = 'UTC';
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Port must come from Fly.io env in production
  const port = process.env.PORT
    ? parseInt(process.env.PORT)
    : configService.get<number>('APP_PORT', 3000);
  const host =
    nodeEnv === 'development'
      ? configService.get<string>('APP_HOST', 'localhost')
      : '0.0.0.0';

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global interceptors & filters
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger only for development
  if (nodeEnv === 'development') {
    const config = new DocumentBuilder()
      .setTitle('CRM API')
      .setDescription('API documentation for CRM system')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    console.log(`📘 Swagger Docs: http://${host}:${port}/api-docs`);
  }

  console.log(`🚀 Server running on ${host}:${port}`);
  await app.listen(port, host);
}

bootstrap();
