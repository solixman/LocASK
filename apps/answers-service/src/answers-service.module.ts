import { Module } from '@nestjs/common';
import { AnswersServiceController } from './answers-service.controller';
import { AnswersServiceService } from './answers-service.service';

@Module({
  imports: [],
  controllers: [AnswersServiceController],
  providers: [AnswersServiceService],
})
export class AnswersServiceModule {}
