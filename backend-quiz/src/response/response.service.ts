import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response, ResponseDocument } from './response.schema';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name)
    private readonly responseModel: Model<ResponseDocument>,
  ) {}

  // response.service.ts - FIXED
  // response.service.ts
  async create(createResponseDto: CreateResponseDto): Promise<Response> {
    // Only validate required fields
    if (
      !createResponseDto.userId ||
      !createResponseDto.questionId ||
      typeof createResponseDto.isCorrect !== 'boolean'
    ) {
      throw new BadRequestException('Missing required fields');
    }

    const response = new this.responseModel({
      userId: new Types.ObjectId(createResponseDto.userId),
      questionId: new Types.ObjectId(createResponseDto.questionId),
      isCorrect: createResponseDto.isCorrect,
      text: createResponseDto.text || null, // Make optional
    });

    return await response.save();
  }

  // Create multiple responses
  async createMultiple(
    createResponseDtos: CreateResponseDto[],
  ): Promise<Response[]> {
    const responses = createResponseDtos.map((dto) => ({
      text: dto.text, // Convert text to ObjectId if it's a string
      questionId: new Types.ObjectId(dto.questionId), // Convert questionId to ObjectId
      isCorrect: dto.isCorrect,
      userId: new Types.ObjectId(dto.userId),
    }));

    // Log responses before insertion to see if the data is as expected
    console.log('Responses to be inserted:', responses);

    // Insert multiple responses
    return this.responseModel.insertMany(responses);
  }

  async findByUserAndQuestion(
    userId: string,
    questionId: string,
  ): Promise<Response | null> {
    return this.responseModel.findOne({
      userId: new Types.ObjectId(userId),
      questionId: new Types.ObjectId(questionId),
    });
  }

  async findAll(): Promise<Response[]> {
    return this.responseModel
      .find()
      .populate('questionId') // Populate the questionId to get the full Question object
      .exec();
  }

  async findById(id: string): Promise<Response> {
    const response = await this.responseModel
      .findById(id)
      .populate('questionId'); // Populate the questionId
    if (!response) throw new NotFoundException('Response not found');
    return response;
  }

  async update(id: string, updateDto: UpdateResponseDto): Promise<Response> {
    const updated = await this.responseModel
      .findByIdAndUpdate(id, updateDto, {
        new: true, // Return the updated document
        runValidators: true, // Run validation on the update
      })
      .populate('questionId'); // Populate the questionId
    if (!updated) throw new NotFoundException('Response not found');
    return updated;
  }

  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.responseModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Response not found');
    return { message: 'Response deleted successfully' };
  }

  async findAllWithQuestions(): Promise<Response[]> {
    return this.responseModel
      .find()
      .populate('questionId') // Populating the `questionId` field with the full Question document
      .exec();
  }

  async findByQuestionId(questionId: string): Promise<Response[]> {
    console.log('Searching for responses with questionId:', questionId);
    const responses = await this.responseModel
      .find({ questionId: new Types.ObjectId(questionId) })
      .populate('questionId') // Populate questionId field
      .exec();
    console.log('Found responses:', responses);
    return responses;
  }
}
