import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

interface AnswerPayload {
    content: string;
    userId: string;
    questionId?: string;
}

@Controller('answers')
export class AnswersController {
    constructor(@Inject('ANSWERS_SERVICE') private answersClient: ClientProxy) { }

    @Get('test')
    test() {
        return this.answersClient.send('test', {});
    }

    @Post()
    createAnswer(@Query() query: { questionId: string }, @Body() data: AnswerPayload) {
        data.questionId = query.questionId;
        return this.answersClient.send('create_answer', data);
    }

    @Get('question/:questionId')
    getAnswers(@Param('questionId') questionId: string) {
        console.log('Received get answers datain the answers apigateway', questionId);
        return this.answersClient.send('get_answers', { questionId: questionId });
    }
}
