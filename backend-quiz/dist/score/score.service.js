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
const question_schema_1 = require("../question/question.schema");
const score_schema_1 = require("./score.schema");
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
        console.log(`Calculating score for user: ${userId}`);
        const responses = await this.responseModel.find({ userId });
        console.log('Found responses:', responses);
        if (!responses || responses.length === 0) {
            throw new common_1.NotFoundException('No responses found for this user.');
        }
        let score = 0;
        for (const response of responses) {
            if (response.isCorrect) {
                score++;
            }
        }
        return {
            userId,
            score,
            createdAt: new Date(),
        };
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