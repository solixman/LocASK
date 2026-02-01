import { Test, TestingModule } from '@nestjs/testing';
import { AnswersServiceController } from './answers-service.controller';
import { AnswersServiceService } from './answers-service.service';

describe('AnswersServiceController', () => {
  let answersServiceController: AnswersServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AnswersServiceController],
      providers: [AnswersServiceService],
    }).compile();

    answersServiceController = app.get<AnswersServiceController>(AnswersServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(answersServiceController.getHello()).toBe('Hello World!');
    });
  });
});
