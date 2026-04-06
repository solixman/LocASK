import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AuthModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3001);
}
bootstrap();