import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AnswersServiceModule } from './answers-service.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AnswersServiceModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3005);
}
bootstrap();