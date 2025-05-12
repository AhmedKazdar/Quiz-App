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
exports.ResponseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const response_schema_1 = require("./response.schema");
let ResponseService = class ResponseService {
    responseModel;
    constructor(responseModel) {
        this.responseModel = responseModel;
    }
    async create(createResponseDto) {
        if (!createResponseDto.userId ||
            !createResponseDto.questionId ||
            typeof createResponseDto.isCorrect !== 'boolean') {
            throw new common_1.BadRequestException('Missing required fields');
        }
        const response = new this.responseModel({
            userId: new mongoose_2.Types.ObjectId(createResponseDto.userId),
            questionId: new mongoose_2.Types.ObjectId(createResponseDto.questionId),
            isCorrect: createResponseDto.isCorrect,
            text: createResponseDto.text || null,
        });
        return await response.save();
    }
    async createMultiple(createResponseDtos) {
        const responses = createResponseDtos.map((dto) => ({
            text: dto.text,
            questionId: new mongoose_2.Types.ObjectId(dto.questionId),
            isCorrect: dto.isCorrect,
            userId: new mongoose_2.Types.ObjectId(dto.userId),
        }));
        console.log('Responses to be inserted:', responses);
        return this.responseModel.insertMany(responses);
    }
    async findByUserAndQuestion(userId, questionId) {
        return this.responseModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            questionId: new mongoose_2.Types.ObjectId(questionId),
        });
    }
    async findAll() {
        return this.responseModel
            .find()
            .populate('questionId')
            .exec();
    }
    async findById(id) {
        const response = await this.responseModel
            .findById(id)
            .populate('questionId');
        if (!response)
            throw new common_1.NotFoundException('Response not found');
        return response;
    }
    async update(id, updateDto) {
        const updated = await this.responseModel
            .findByIdAndUpdate(id, updateDto, {
            new: true,
            runValidators: true,
        })
            .populate('questionId');
        if (!updated)
            throw new common_1.NotFoundException('Response not found');
        return updated;
    }
    async delete(id) {
        const deleted = await this.responseModel.findByIdAndDelete(id);
        if (!deleted)
            throw new common_1.NotFoundException('Response not found');
        return { message: 'Response deleted successfully' };
    }
    async findAllWithQuestions() {
        return this.responseModel
            .find()
            .populate('questionId')
            .exec();
    }
    async findByQuestionId(questionId) {
        console.log('Searching for responses with questionId:', questionId);
        const responses = await this.responseModel
            .find({ questionId: new mongoose_2.Types.ObjectId(questionId) })
            .populate('questionId')
            .exec();
        console.log('Found responses:', responses);
        return responses;
    }
};
exports.ResponseService = ResponseService;
exports.ResponseService = ResponseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(response_schema_1.Response.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ResponseService);
//# sourceMappingURL=response.service.js.map