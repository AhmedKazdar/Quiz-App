import { IsString, IsBoolean, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResponseDto {
  @ApiProperty({
    description: 'text of the response',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'questionId of the response',
  })
  @IsString()
  @IsNotEmpty()
  questionId: string; // Question ID for the response

  @ApiProperty({
    description: 'True or false',
  })
  @IsBoolean()
  isCorrect: boolean; // Mark if the response is correct

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
