import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  app.enableCors({
    origin: [
      'http://localhost:3000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
