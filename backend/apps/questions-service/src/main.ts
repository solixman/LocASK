import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { QuestionsModule } from './questions.module';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(QuestionsModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3003);
}
bootstrap();