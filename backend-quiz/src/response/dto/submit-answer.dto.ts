import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class SubmitAnswerDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsString()
  @IsNotEmpty()
  selectedAnswerText: string;
}
