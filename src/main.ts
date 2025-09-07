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

  const port = configService.get<number>('APP_PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger only for development
  if (nodeEnv === 'development') {
    const host = configService.get<string>('APP_HOST', 'localhost');
    const config = new DocumentBuilder()
      .setTitle('CRM API')
      .setDescription('API documentation for CRM system')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    console.log(`📘 Swagger Docs: http://${host}:${port}/api-docs`);
    console.log(`🚀 Server running at http://${host}:${port}/`);
    await app.listen(port, host);
  } else {
    // Production / Fly.io
    app.enableCors();
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());

    console.log(`🚀 Server running on 0.0.0.0:${port} (production)`);
    await app.listen(port, '0.0.0.0');
  }
}

bootstrap();
