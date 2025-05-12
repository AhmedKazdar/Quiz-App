import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ResponseService } from './response.service';
import { UserService } from '../user/user.service';
import { QuestionService } from '../question/question.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

// Define a type for the response object (this can be the same as your DTO if needed)
interface Response {
  userId: Types.ObjectId;
  questionId: Types.ObjectId;
  isCorrect: boolean;
  text: string;
}

@ApiTags('response')
@Controller('response')
export class ResponseController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Creates a new response' })
  @ApiCreatedResponse({ description: 'Response created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  async create(@Body() createResponseDto: CreateResponseDto) {
    const { questionId } = createResponseDto;

    // Validate questionId format
    if (!Types.ObjectId.isValid(questionId)) {
      throw new BadRequestException('Invalid questionId format');
    }

    try {
      const response = await this.responseService.create(createResponseDto);
      return { message: 'Response created successfully', response };
    } catch (error) {
      throw new BadRequestException('Failed to create response');
    }
  }

  @Post('create-multiple')
  @ApiOperation({ summary: 'Creates multiple responses' })
  @ApiCreatedResponse({ description: 'Responses created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  async createMultiple(@Body() createResponseDtos: CreateResponseDto[]) {
    try {
      const responses =
        await this.responseService.createMultiple(createResponseDtos);
      return { message: 'Responses created successfully', responses };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get('ping')
  ping() {
    return 'pong';
  }

  @Post('submit')
  @ApiOperation({
    summary: 'Submit multiple responses (userId, questionId, isCorrect)',
  })
  @ApiCreatedResponse({ description: 'Responses submitted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiNotFoundResponse({ description: 'User or Question not found' })
  async submitResponses(@Body() responses: SubmitAnswerDto[]) {
    const results: Response[] = [];
    let totalScore = 0;

    for (const responseData of responses) {
      const { userId, questionId, isCorrect, selectedAnswerText } =
        responseData;

      if (
        !userId ||
        !questionId ||
        typeof isCorrect !== 'boolean' ||
        !selectedAnswerText
      ) {
        console.log('Invalid response data:', responseData);
        continue;
      }

      try {
        // Log the user and question being fetched
        console.log('Fetching user with ID:', userId);
        const user = await this.userService.findById(userId);
        if (!user) {
          console.log('User not found for ID:', userId);
          throw new NotFoundException(`User ${userId} not found`);
        }

        console.log('Fetching question with ID:', questionId);
        const question = await this.questionService.findById(questionId);
        if (!question) {
          console.log('Question not found for ID:', questionId);
          throw new NotFoundException(`Question ${questionId} not found`);
        }

        const existingResponse =
          await this.responseService.findByUserAndQuestion(userId, questionId);
        console.log('Checking for existing response...');
        if (existingResponse) {
          console.log(
            'Response already exists for user:',
            userId,
            'and question:',
            questionId,
          );
          continue;
        }

        // Create a new response
        // Assuming Response schema's text is now a string
        const newResponse = await this.responseService.create({
          userId: new Types.ObjectId(userId), // Make sure it's an ObjectId
          questionId: new Types.ObjectId(questionId),
          isCorrect,
          text: selectedAnswerText,
        });

        console.log('New Response Saved:', newResponse); // Log to verify

        results.push(newResponse);

        // Convert ObjectId to string before pushing it to results
        const newResponseFormatted = {
          ...newResponse,
          text: newResponse.text.toString(), // Convert ObjectId to string
        };

        results.push(newResponseFormatted);

        if (isCorrect) {
          totalScore += 1;
        }
      } catch (error) {
        console.error('Error creating response:', error.message);
        results.push({
          userId: new Types.ObjectId(userId),
          questionId: new Types.ObjectId(questionId),
          isCorrect,
          text: `Error: ${error.message}`,
        });
      }
    }

    console.log('Final Score:', totalScore);
    return {
      message: 'Responses submitted successfully',
      responses: results,
      score: totalScore,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Fetch a list of responses' })
  @ApiOkResponse({ description: 'List of responses fetched successfully' })
  async findAll() {
    try {
      const responses = await this.responseService.findAllWithQuestions();
      return { message: 'Fetched all responses', responses };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get('question/:questionId')
  @ApiOperation({ summary: 'Fetch responses by questionId' })
  @ApiOkResponse({ description: 'Responses found' })
  @ApiNotFoundResponse({ description: 'No responses found for the question' })
  async findByQuestionId(@Param('questionId') questionId: string) {
    try {
      const responses = await this.responseService.findByQuestionId(questionId);
      if (responses.length === 0) {
        return { message: 'No responses found for this question' };
      }
      return { message: 'Fetched responses for question', responses };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    try {
      const updatedResponse = await this.responseService.update(
        id,
        updateResponseDto,
      );
      return { message: 'Response updated successfully', updatedResponse };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const deleteResult = await this.responseService.delete(id);
      return { message: deleteResult.message };
    } catch (error) {
      return { message: error.message };
    }
  }
}
