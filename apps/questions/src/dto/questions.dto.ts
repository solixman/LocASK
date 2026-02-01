export class CreateQuestionDto {
  title: string;
  content: string;
  latitude: number;
  longitude: number;
  userId: string;
}

export class GetQuestionsDto {
  latitude: number;
  longitude: number;
  userId?: string;
}

export class ToggleLikeDto {
  questionId: string;
  userId: string;
}
