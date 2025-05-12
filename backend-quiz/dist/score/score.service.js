"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../user/user.schema");
const response_schema_1 = require("../response/response.schema");
const score_schema_1 = require("./score.schema");
const question_schema_1 = require("../question/question.schema");
let ScoreService = class ScoreService {
    scoreModel;
    userModel;
    responseModel;
    questionModel;
    constructor(scoreModel, userModel, responseModel, questionModel) {
        this.scoreModel = scoreModel;
        this.userModel = userModel;
        this.responseModel = responseModel;
        this.questionModel = questionModel;
    }
    async calculateScore(userId) {
        try {
            if (!mongoose_2.Types.ObjectId.isValid(userId)) {
                throw new common_1.BadRequestException('Invalid userId format');
            }
            const objectId = new mongoose_2.Types.ObjectId(userId);
            const userExists = await this.userModel.findById(objectId);
            if (!userExists) {
                throw new common_1.NotFoundException('User not found');
            }
            console.log('Fetching responses for user:', objectId);
            const allResponses = await this.responseModel.find().exec();
            console.log('All Responses in the DB:', allResponses);
            const responses = await this.responseModel
                .find({ userId: objectId })
                .exec();
            console.log('Fetched Responses:', responses);
            if (responses.length === 0) {
                console.log('No responses found for user:', objectId);
                return { score: 0 };
            }
            let score = 0;
            for (const response of responses) {
                console.log('Received responseData:', response);
                const isCorrectStr = String(response.isCorrect).toLowerCase();
                if (isCorrectStr !== 'true' && isCorrectStr !== 'false') {
                    console.warn('Invalid isCorrect value (not a valid boolean string or boolean), skipping:', response);
                    continue;
                }
                const isCorrect = isCorrectStr === 'true';
                if (isCorrect) {
                    score += 1;
                }
            }
            console.log('Calculated Score:', score);
            const existingScore = await this.scoreModel.findOneAndUpdate({ userId: objectId }, { score, createdAt: new Date() }, { new: true, upsert: true });
            console.log('Existing Score After Update:', existingScore);
            const populatedScore = await this.scoreModel
                .findById(existingScore._id)
                .populate('userId', 'username')
                .exec();
            console.log('Populated Score:', populatedScore);
            if (!populatedScore || !populatedScore.userId) {
                throw new common_1.InternalServerErrorException('User details could not be populated for the score.');
            }
            return populatedScore;
        }
        catch (error) {
            console.error('Error during score calculation:', error.message, error.stack);
            throw new common_1.InternalServerErrorException('An error occurred while calculating the score. Please try again later.');
        }
    }
    async syncUserScore(userId) {
        const correctAnswers = await this.responseModel.countDocuments({
            userId: new mongoose_2.Types.ObjectId(userId),
            isCorrect: true,
        });
        return this.scoreModel.findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId) }, { score: correctAnswers, createdAt: new Date() }, { upsert: true, new: true });
    }
    async getTopRanking() {
        return await this.scoreModel
            .find()
            .sort({ score: -1 })
            .limit(5)
            .populate('userId', 'username')
            .exec();
    }
};
exports.ScoreService = ScoreService;
exports.ScoreService = ScoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(score_schema_1.Score.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(response_schema_1.Response.name)),
    __param(3, (0, mongoose_1.InjectModel)(question_schema_1.Question.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ScoreService);
//# sourceMappingURL=score.service.js.map