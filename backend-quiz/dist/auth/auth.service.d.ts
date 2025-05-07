import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        access_token: string;
        username: string;
        role: string;
        userId: unknown;
    }>;
    createAdminUser(createUserDto: any): Promise<import("../user/user.schema").UserDocument>;
}
