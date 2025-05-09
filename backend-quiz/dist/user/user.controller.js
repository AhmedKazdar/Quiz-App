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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const roles_decorator_1 = require("../decorators/roles.decorator");
const roles_guard_1 = require("./roles.guard");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const login_dto_1 = require("./dto/login.dto");
const common_2 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const online_gateway_1 = require("../gateways/online.gateway");
let UserController = class UserController {
    userService;
    onlineGateway;
    constructor(userService, onlineGateway) {
        this.userService = userService;
        this.onlineGateway = onlineGateway;
    }
    async createAdminUser(createUserDto) {
        try {
            const user = await this.userService.create(createUserDto);
            return { message: 'User created successfully by admin', user };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async registerUser(createUserDto) {
        try {
            createUserDto.role = 'user';
            const user = await this.userService.create(createUserDto);
            return { message: 'User registered successfully', user };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async login(loginDto) {
        console.log('Received loginDto:', loginDto);
        try {
            const token = await this.userService.login(loginDto);
            return { message: 'Login successful', token };
        }
        catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
    async getAllUsers() {
        try {
            const users = await this.userService.getAllUsers();
            return { message: 'Users extracted successfully', users };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async getOnlineUsers() {
        try {
            const onlineUsers = this.onlineGateway.getOnlineUsers();
            return { message: 'Online users retrieved successfully', onlineUsers };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async getUserById(id) {
        try {
            const user = await this.userService.findById(id);
            if (!user) {
                throw new common_2.UnauthorizedException('User not found');
            }
            return { message: 'User retrieved successfully', user };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async updateUser(id, updateUserDto) {
        try {
            const updatedUser = await this.userService.updateUser(id, updateUserDto);
            if (!updatedUser) {
                throw new common_2.UnauthorizedException('User not found');
            }
            return { message: 'User updated successfully', updatedUser };
        }
        catch (error) {
            return { message: error.message };
        }
    }
    async deleteUser(id) {
        try {
            const response = await this.userService.deleteUser(id);
            return { message: response.message };
        }
        catch (error) {
            return { message: error.message };
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createAdminUser", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Creates a new user' }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'User created successfully',
        type: create_user_dto_1.CreateUserDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid data provided' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch a list of users ' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'List of users fetched sucessfully.',
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('online'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch online users' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Online users retrieved successfully.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOnlineUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Fetch a user by id' }),
    (0, swagger_1.ApiOkResponse)({ description: 'User found' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found.' }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)('update/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        online_gateway_1.OnlineGateway])
], UserController);
//# sourceMappingURL=user.controller.js.map