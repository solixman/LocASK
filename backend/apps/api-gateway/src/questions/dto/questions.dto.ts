import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  longitude: number;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class GetQuestionsDto {
  @IsOptional()
  latitude?: any;

  @IsOptional()
  longitude?: any;

  @IsOptional()
  userId?: string;
}

export class ToggleLikeDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
