import { Body, Controller, Get, Inject, Logger, Param, Post, Query, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateQuestionDto, GetQuestionsDto, ToggleLikeDto } from './dto/questions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('questions')
export class QuestionsController {

    constructor(@Inject('QUESTIONS_SERVICE') private questionsClient: ClientProxy) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createQuestion(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
        // Ensure userId comes from the authenticated user
        createQuestionDto.userId = req.user.userId;
        return this.questionsClient.send('create_question', createQuestionDto);
    }

    @Get()
    getQuestions(@Query() query: GetQuestionsDto) {
        const payload = {
            latitude: query.latitude ? Number(query.latitude) : undefined,
            longitude: query.longitude ? Number(query.longitude) : undefined
        };
        return this.questionsClient.send('get_questions', payload);
    }

    @Get('liked')
    getLikedQuestions(@Query() query: GetQuestionsDto) {
        const payload = {
            latitude: query.latitude ? Number(query.latitude) : undefined,
            longitude: query.longitude ? Number(query.longitude) : undefined,
            userId: query.userId
        };
        return this.questionsClient.send('get_liked_questions', payload);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    toggleLike(@Param('id') questionId: string, @Request() req) {
        return this.questionsClient.send('toggle_like', {
            questionId,
            userId: req.user.userId,
        });
    }

    @Get('test')
    test() {
        return this.questionsClient.send('test', {});
    }

}
