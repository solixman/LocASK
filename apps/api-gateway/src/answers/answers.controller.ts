import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('answers')
export class AnswersController {
    constructor(@Inject('ANSWERS_SERVICE') private answersClient:ClientProxy){}

    @Get('test')
    test(){
        return  this.answersClient.send('test', {});
    }
}
