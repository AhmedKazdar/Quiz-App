import { Model, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Response } from '../response/response.schema';
import { Question } from '../question/question.schema';
import { Score } from './score.schema';
export declare class ScoreService {
    private scoreModel;
    private userModel;
    private responseModel;
    private questionModel;
    constructor(scoreModel: Model<Score>, userModel: Model<User>, responseModel: Model<Response>, questionModel: Model<Question>);
    calculateScore(userId: Types.ObjectId): Promise<Score>;
    getTopRanking(): Promise<Score[]>;
}
