import { Body, Controller, Get, Inject, Param, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAnswerDto, GetAnswersQueryDto } from './dto/answers.dto';

@Controller('answers')
export class AnswersController {
    constructor(@Inject('ANSWERS_SERVICE') private answersClient: ClientProxy) { }

    @Get('test')
    test() {
        return this.answersClient.send('test', {});
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createAnswer(
        @Query() query: GetAnswersQueryDto,
        @Body() data: CreateAnswerDto,
        @Request() req
    ) {
        data.questionId = query.questionId;
        data.userId = req.user.userId;
        return this.answersClient.send('create_answer', data);
    }

    @Get('question/:questionId')
    getAnswers(@Param('questionId') questionId: string) {
        console.log('Received get answers datain the answers apigateway', questionId);
        return this.answersClient.send('get_answers', { questionId: questionId });
    }
}
