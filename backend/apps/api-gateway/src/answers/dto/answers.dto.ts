import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAnswerDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    questionId?: string;
}

export class GetAnswersQueryDto {
    @IsUUID()
    @IsNotEmpty()
    questionId: string;
}
