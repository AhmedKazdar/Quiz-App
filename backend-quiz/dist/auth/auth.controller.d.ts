import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        username: string;
        role: string;
        userId: unknown;
    }>;
    createAdminUser(createUserDto: CreateUserDto): Promise<import("../user/user.schema").UserDocument>;
}
