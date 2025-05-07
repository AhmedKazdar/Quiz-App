import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard'; // Path relative to the controller
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Admin creates a new user
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can access
  async createAdminUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return { message: 'User created successfully by admin', user };
    } catch (error) {
      return { message: error.message };
    }
  }

  // Normal users can self-register
  @Post('register')
  @ApiOperation({ summary: 'Creates a new user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  // No guards for registration
  async registerUser(@Body() createUserDto: CreateUserDto) {
    try {
      createUserDto.role = 'user'; // Set default role to 'user'
      const user = await this.userService.create(createUserDto);
      return { message: 'User registered successfully', user };
    } catch (error) {
      return { message: error.message };
    }
  }

  // Login: Generate JWT token
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    console.log('Received loginDto:', loginDto); // helpful debug log

    try {
      const token = await this.userService.login(loginDto);
      return { message: 'Login successful', token };
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Let NestJS handle the error response
    }
  }

  // Get all users (Admin only)
  @Get('all')
  @ApiOperation({ summary: 'Fetch a list of users ' })
  @ApiOkResponse({
    description: 'List of users fetched sucessfully.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard) // Use both guards here
  @Roles('admin') // Only admins can access
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      return { message: 'Users extracted successfully', users };
    } catch (error) {
      return { message: error.message };
    }
  }

  // Get user by ID

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a user by id' })
  @ApiOkResponse({ description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return { message: 'User retrieved successfully', user };
    } catch (error) {
      return { message: error.message };
    }
  }

  // Update user

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      if (!updatedUser) {
        throw new UnauthorizedException('User not found');
      }
      return { message: 'User updated successfully', updatedUser };
    } catch (error) {
      return { message: error.message };
    }
  }

  // Delete user (Admin only)

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only admins can delete users
  async deleteUser(@Param('id') id: string) {
    try {
      const response = await this.userService.deleteUser(id);
      return { message: response.message };
    } catch (error) {
      return { message: error.message };
    }
  }
}
