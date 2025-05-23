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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResponseDto = void 0;
const class_validator_1 = require("@nestjs/class-validator");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("mongoose");
class CreateResponseDto {
    text;
    questionId;
    isCorrect;
    userId;
}
exports.CreateResponseDto = CreateResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Text of the response' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateResponseDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Question ID for the response' }),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateResponseDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mark if the response is correct' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateResponseDto.prototype, "isCorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", mongoose_1.Types.ObjectId)
], CreateResponseDto.prototype, "userId", void 0);
//# sourceMappingURL=create-response.dto.js.map