"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModule = void 0;
const common_1 = require("@nestjs/common");
const response_service_1 = require("./response.service");
const mongoose_1 = require("@nestjs/mongoose");
const response_schema_1 = require("./response.schema");
const response_controller_1 = require("./response.controller");
let ResponseModule = class ResponseModule {
};
exports.ResponseModule = ResponseModule;
exports.ResponseModule = ResponseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: response_schema_1.Response.name, schema: response_schema_1.ResponseSchema },
            ]),
        ],
        providers: [response_service_1.ResponseService],
        controllers: [response_controller_1.ResponseController],
        exports: [response_service_1.ResponseService],
    })
], ResponseModule);
//# sourceMappingURL=response.module.js.map