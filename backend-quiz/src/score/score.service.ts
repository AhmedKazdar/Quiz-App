import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Response } from '../response/response.schema';
import { Score, ScoreDocument } from './score.schema';
import { Question } from '../question/question.schema';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<ScoreDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Response.name) private responseModel: Model<Response>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async calculateScore(userId: string): Promise<Score> {
    try {
      // Validate the userId format
      if (!Types.ObjectId.isValid(userId)) {
        throw new BadRequestException('Invalid userId format');
      }

      const objectId = new Types.ObjectId(userId);

      // Check if user exists
      const userExists = await this.userModel.findById(objectId);
      if (!userExists) {
        throw new NotFoundException('User not found');
      }

      console.log('Fetching responses for user:', objectId);

      // Check if responses for this user exist before querying
      const allResponses = await this.responseModel.find().exec();
      console.log('All Responses in the DB:', allResponses);

      // Fetch responses for the user and ensure question is populated
      const responses = await this.responseModel
        .find({ userId: objectId })
        .exec();

      console.log('Fetched Responses:', responses); // Log fetched responses

      if (responses.length === 0) {
        console.log('No responses found for user:', objectId);
        return { score: 0 } as Score; // Return 0 if no responses found
      }

      let score = 0;

      // Loop through each response and check if it is correct
      for (const response of responses) {
        console.log('Received responseData:', response);

        const isCorrectStr = String(response.isCorrect).toLowerCase();

        if (isCorrectStr !== 'true' && isCorrectStr !== 'false') {
          console.warn(
            'Invalid isCorrect value (not a valid boolean string or boolean), skipping:',
            response,
          );
          continue;
        }

        const isCorrect = isCorrectStr === 'true';

        if (isCorrect) {
          score += 1;
        }
      }

      console.log('Calculated Score:', score);

      // Now update or create the user's score in the Score model
      const existingScore = await this.scoreModel.findOneAndUpdate(
        { userId: objectId },
        { score, createdAt: new Date() },
        { new: true, upsert: true },
      );

      console.log('Existing Score After Update:', existingScore);

      // Populate the score with user details
      const populatedScore = await this.scoreModel
        .findById(existingScore._id)
        .populate('userId', 'username')
        .exec();

      console.log('Populated Score:', populatedScore);

      if (!populatedScore || !populatedScore.userId) {
        throw new InternalServerErrorException(
          'User details could not be populated for the score.',
        );
      }

      return populatedScore;
    } catch (error) {
      console.error(
        'Error during score calculation:',
        error.message,
        error.stack,
      );
      throw new InternalServerErrorException(
        'An error occurred while calculating the score. Please try again later.',
      );
    }
  }

  // score.service.ts
  async syncUserScore(userId: string): Promise<Score> {
    const correctAnswers = await this.responseModel.countDocuments({
      userId: new Types.ObjectId(userId),
      isCorrect: true,
    });

    return this.scoreModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { score: correctAnswers, createdAt: new Date() },
      { upsert: true, new: true },
    );
  }

  // Method to get top rankings
  async getTopRanking(): Promise<Score[]> {
    return await this.scoreModel
      .find()
      .sort({ score: -1 })
      .limit(5)
      .populate('userId', 'username') // Populate username for ranking
      .exec();
  }
}
