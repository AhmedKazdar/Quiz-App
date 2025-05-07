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
exports.ResponseController = void 0;
const common_1 = require("@nestjs/common");
const response_service_1 = require("./response.service");
const create_response_dto_1 = require("./dto/create-response.dto");
const update_response_dto_1 = require("./dto/update-response.dto");
const swagger_1 = require("@nestjs/swagger");
let ResponseController = class ResponseController {
    responseService;
    constructor(responseService) {
        this.responseService = responseService;
    }
    async create(createResponseDto) {
        try {
            const response = await this.responseService.create(createResponseDto);
            return { message: 'Response created successfully', response };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async createMultiple(createResponseDtos) {
        try {
            const responses = await this.responseService.createMultiple(createResponseDtos);
            return { message: 'Responses created successfully', responses };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async findAll() {
        try {
            const responses = await this.responseService.findAllWithQuestions();
            return { message: 'Fetched all responses', responses };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async findByQuestionId(questionId) {
        try {
            const responses = await this.responseService.findByQuestionId(questionId);
            if (responses.length === 0) {
                return { message: 'No responses found for this question' };
            }
            return { message: 'Fetched responses for question', responses };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async update(id, updateResponseDto) {
        try {
            const updatedResponse = await this.responseService.update(id, updateResponseDto);
            return { message: 'Response updated successfully', updatedResponse };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async delete(id) {
        try {
            const deleteResult = await this.responseService.delete(id);
            return { message: deleteResult.message };
        }
        catch (error) {
            return { message: error.message };
        }
    }
};
exports.ResponseController = ResponseController;
__decorate([
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new response' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Response created successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid data provided' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_response_dto_1.CreateResponseDto]),
    __metadata("design:returntype", Promise)
], ResponseController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('create-multiple'),
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new response' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Response created successfully' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid data provided' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ResponseController.prototype, "createMultiple", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch a list of answers ' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of answers fetched sucessfully.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ResponseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('question/:questionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch a answer by id' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Answer found' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Answer not found.' }),
    __param(0, (0, common_1.Param)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResponseController.prototype, "findByQuestionId", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_response_dto_1.UpdateResponseDto]),
    __metadata("design:returntype", Promise)
], ResponseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResponseController.prototype, "delete", null);
exports.ResponseController = ResponseController = __decorate([
    (0, swagger_1.ApiTags)('response'),
    (0, common_1.Controller)('response'),
    __metadata("design:paramtypes", [response_service_1.ResponseService])
], ResponseController);
//# sourceMappingURL=response.controller.js.map