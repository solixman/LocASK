import { NestFactory } from '@nestjs/core';
import { QuestionsModule } from './questions.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(QuestionsModule,{
    transport:Transport.TCP,
    options:{
      host:'127.0.0.1',
      port: 4002, 
    }
  });
  await app.listen();
  console.log('Questions service up and running with TCP on port 4001')
}
bootstrap();
