import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Response } from '../response/response.schema';
import { Question } from '../question/question.schema';
import { Score } from './score.schema';

@Injectable()
export class ScoreService {
  constructor(
    @InjectModel(Score.name) private scoreModel: Model<Score>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Response.name) private responseModel: Model<Response>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  // Function to calculate and save the score
  async calculateScore(userId: Types.ObjectId): Promise<Score> {
    console.log(`Calculating score for user: ${userId}`);

    // Fetch all responses for the user
    const responses = await this.responseModel.find({ userId });

    // Log the responses to see if we get any data
    console.log('Found responses:', responses);

    // Check if no responses are found for the user
    if (!responses || responses.length === 0) {
      throw new NotFoundException('No responses found for this user.');
    }

    // Calculate the score (just for testing, we're using the number of correct responses)
    let score = 0;
    for (const response of responses) {
      if (response.isCorrect) {
        score++;
      }
    }

    // Return a valid Score object (filling in required fields)
    return {
      userId,
      score,
      createdAt: new Date(),
      // Add any other necessary fields if required for Score
    };
  }

  // Function to get top rankings
  async getTopRanking(): Promise<Score[]> {
    return await this.scoreModel
      .find()
      .sort({ score: -1 }) // Sort by score in descending order
      .limit(5) // Limit to top 5
      .populate('userId', 'username') // Populate the username field from the User model
      .exec();
  }
}
