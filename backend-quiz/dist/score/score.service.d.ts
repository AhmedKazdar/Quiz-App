import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { Response } from '../response/response.schema';
import { Score, ScoreDocument } from './score.schema';
import { Question } from '../question/question.schema';
export declare class ScoreService {
    private scoreModel;
    private userModel;
    private responseModel;
    private questionModel;
    constructor(scoreModel: Model<ScoreDocument>, userModel: Model<User>, responseModel: Model<Response>, questionModel: Model<Question>);
    calculateScore(userId: string): Promise<Score>;
    syncUserScore(userId: string): Promise<Score>;
    getTopRanking(): Promise<Score[]>;
}
