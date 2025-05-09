"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const question_module_1 = require("./question/question.module");
const response_module_1 = require("./response/response.module");
const result_module_1 = require("./result/result.module");
const score_module_1 = require("./score/score.module");
const online_gateway_1 = require("./gateways/online.gateway");
const online_module_1 = require("./gateways/online.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb+srv://ahmedkazdar:ahmed@cluster0.qyu9hzf.mongodb.net/Quiz?retryWrites=true&w=majority&appName=Cluster0'),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            question_module_1.QuestionModule,
            response_module_1.ResponseModule,
            result_module_1.ResultModule,
            score_module_1.ScoreModule,
            online_module_1.OnlineModule,
        ],
        providers: [online_gateway_1.OnlineGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map