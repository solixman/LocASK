import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { ApiGatewayModule } from './api-gateway.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(ApiGatewayModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5179', 'http://localhost:3000'], // Frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
