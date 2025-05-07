import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Login method
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      console.log(`Login attempt with invalid email: ${email}`); // Debugging line
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Failed password attempt for email: ${email}`); // Debugging line
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: user.email,
      sub: user._id,
      username: user.username,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,

      username: user.username,
      role: user.role,
      userId: user._id,
    };
  }

  // Register method (for admin use)
  async createAdminUser(createUserDto) {
    // Here you can call the UserService to create an admin user
    return this.userService.create(createUserDto);
  }
}
