import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service'; // Correct import path for UserService
import { UnauthorizedException } from '@nestjs/common'; // To throw proper exceptions

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Bearer header
      ignoreExpiration: false, // Do not ignore expiration
      secretOrKey: '123456', // Use a secure secret key, change for production
    });
  }

  // This method validates the JWT payload
  async validate(payload: any) {
    // Validate the user from the JWT payload
    const user = await this.userService.findByEmail(payload.email);

    if (!user) {
      // If user is not found, throw UnauthorizedException
      throw new UnauthorizedException('User not found');
    }

    // Return user data, this will be available in controllers or guards
    return {
      userId: user._id,
      username: user.username, // Changed to use the actual username from the DB
      email: user.email,
      role: user.role, // Use the email from the DB as a backup
    };
  }
}
