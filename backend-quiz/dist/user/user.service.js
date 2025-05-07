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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const user_schema_1 = require("./user.schema");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
let UserService = class UserService {
    userModel;
    jwtService;
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async checkIfUserExists(createUserDto) {
        const { username, email, phoneNumber } = createUserDto;
        const existingUser = await this.userModel
            .findOne({
            $or: [{ username }, { email }, { phoneNumber }],
        })
            .exec();
        if (existingUser) {
            if (existingUser.username === username) {
                throw new common_1.ConflictException('Username already exists');
            }
            if (existingUser.email === email) {
                throw new common_1.ConflictException('Email already exists');
            }
            if (existingUser.phoneNumber === phoneNumber) {
                throw new common_1.ConflictException('Phone number already exists');
            }
        }
    }
    async create(createUserDto) {
        console.log('Create user DTO:', createUserDto);
        await this.checkIfUserExists(createUserDto);
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
        console.log('User successfully created:', createdUser);
        return createdUser.save();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async getAllUsers() {
        return this.userModel.find().exec();
    }
    async updateUser(id, updateUserDto) {
        const hashedPassword = updateUserDto.password
            ? await bcrypt.hash(updateUserDto.password, 10)
            : undefined;
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, {
            ...updateUserDto,
            password: hashedPassword ? hashedPassword : undefined,
        }, { new: true })
            .exec();
        if (!updatedUser) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return updatedUser;
    }
    async deleteUser(id) {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return { message: 'User deleted successfully' };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        console.log('Password to compare:', password);
        console.log('Hashed password from DB:', user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Is password valid:', isPasswordValid);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const payload = { email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return token;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map