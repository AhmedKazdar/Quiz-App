import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsMongoId,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {
  @ApiProperty({ description: 'Text of the response' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Question ID for the response' })
  @IsMongoId()
  questionId: string; // Expecting ObjectId in string format

  @ApiProperty({ description: 'Mark if the response is correct' })
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty()
  @IsMongoId()
  userId: string; // Expecting ObjectId in string format
}
