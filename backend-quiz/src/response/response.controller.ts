import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ResponseService } from './response.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('response')
@Controller('response')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  /////// simple response

  @Post('create')
  @ApiOperation({ summary: 'Creates a new response' })
  @ApiCreatedResponse({ description: 'Response created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  async create(@Body() createResponseDto: CreateResponseDto) {
    try {
      const response = await this.responseService.create(createResponseDto);
      return { message: 'Response created successfully', response };
    } catch (error) {
      return { message: error.message };
    }
  }

  /////multiple responses

  @Post('create-multiple')
  @ApiOperation({ summary: 'Creates a new response' })
  @ApiCreatedResponse({ description: 'Response created successfully' })
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

  ////Get all answers

  @Get()
  @ApiOperation({ summary: 'Fetch a list of answers ' })
  @ApiOkResponse({
    description: 'List of answers fetched sucessfully.',
  })
  async findAll() {
    try {
      const responses = await this.responseService.findAllWithQuestions();
      return { message: 'Fetched all responses', responses };
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get('question/:questionId')
  @ApiOperation({ summary: 'Fetch a answer by id' })
  @ApiOkResponse({ description: 'Answer found' })
  @ApiNotFoundResponse({ description: 'Answer not found.' })
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

  /*  // 🟡 Moved to the bottom to avoid route conflicts
  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const response = await this.responseService.findById(id);
      return { message: 'Fetched response by ID', response };
    } catch (error) {
      return { message: error.message };
    }
  }
 */

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
