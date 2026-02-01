import { Injectable } from '@nestjs/common';

@Injectable()
export class AnswersServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
