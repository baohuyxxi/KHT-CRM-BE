import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const host = configService.get<string>('APP_HOST', 'localhost');
  const port = configService.get<number>('APP_PORT', 3000);

  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  app.setGlobalPrefix('api/v1');

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

  //cors
  app.enableCors();

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(port, host);

  console.log(`🚀 Server running at http://${host}:${port}/`);
}
bootstrap();
