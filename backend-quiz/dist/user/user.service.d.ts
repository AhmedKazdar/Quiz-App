import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
export declare class UserService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    private checkIfUserExists;
    create(createUserDto: CreateUserDto): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    getAllUsers(): Promise<UserDocument[]>;
    updateUser(id: string, updateUserDto: CreateUserDto): Promise<UserDocument>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<string>;
}
