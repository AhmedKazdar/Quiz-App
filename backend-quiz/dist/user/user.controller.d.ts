import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createAdminUser(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: import("./user.schema").UserDocument;
    } | {
        message: any;
        user?: undefined;
    }>;
    registerUser(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: import("./user.schema").UserDocument;
    } | {
        message: any;
        user?: undefined;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        token: string;
    }>;
    getAllUsers(): Promise<{
        message: string;
        users: import("./user.schema").UserDocument[];
    } | {
        message: any;
        users?: undefined;
    }>;
    getUserById(id: string): Promise<{
        message: string;
        user: import("./user.schema").UserDocument;
    } | {
        message: any;
        user?: undefined;
    }>;
    updateUser(id: string, updateUserDto: CreateUserDto): Promise<{
        message: string;
        updatedUser: import("./user.schema").UserDocument;
    } | {
        message: any;
        updatedUser?: undefined;
    }>;
    deleteUser(id: string): Promise<{
        message: any;
    }>;
}
