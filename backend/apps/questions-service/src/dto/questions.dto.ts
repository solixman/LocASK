export class CreateQuestionDto {
  title!: string;
  content!: string;
  latitude!: number;
  longitude!: number;
  userId!: string;
}

export class LikeQuestionDto {
  questionId!: string;
  userId!: string;
}