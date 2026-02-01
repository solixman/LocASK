import { Module } from '@nestjs/common';
import { AnswersServiceController } from './answers-service.controller';
import { AnswersServiceService } from './answers-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'QUESTIONS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4002,
        },
      },
    ]),
  ],
  controllers: [AnswersServiceController],
  providers: [AnswersServiceService],
})
export class AnswersServiceModule { }
