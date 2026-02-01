import { NestFactory } from '@nestjs/core';
import { AnswersServiceModule } from './answers-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AnswersServiceModule,{
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4003,
    },
  });
  await app.listen();
}
bootstrap();
