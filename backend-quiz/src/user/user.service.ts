/* import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // Get all users
  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  // Update user by ID
  async updateUser(
    id: string,
    updateUserDto: CreateUserDto,
  ): Promise<UserDocument> {
    const hashedPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : undefined;
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...updateUserDto,
          password: hashedPassword ? hashedPassword : undefined,
        },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return updatedUser;
  }

  // Delete user by ID
  async deleteUser(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new UnauthorizedException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  //////////// Login
  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, role: user.role };
    const token = this.jwtService.sign(payload); // Sign the payload to generate token

    return token;
  }
}
 */

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // Check if the username, email, or phone number already exists
  private async checkIfUserExists(createUserDto: CreateUserDto): Promise<void> {
    const { username, email, phoneNumber } = createUserDto;

    // Check if any of the fields already exist in the database
    const existingUser = await this.userModel
      .findOne({
        $or: [{ username }, { email }, { phoneNumber }],
      })
      .exec();

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.phoneNumber === phoneNumber) {
        throw new ConflictException('Phone number already exists');
      }
    }
  }

  // Create a new user after checking if username, email, or phone number already exist
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // Log incoming data for debugging
    console.log('Create user DTO:', createUserDto);

    await this.checkIfUserExists(createUserDto); // Check for existing user

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    // Log created user data for debugging
    console.log('User successfully created:', createdUser);

    return createdUser.save();
  }

  // Find a user by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // Find a user by ID
  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  // Get all users
  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  // Update user by ID
  async updateUser(
    id: string,
    updateUserDto: CreateUserDto,
  ): Promise<UserDocument> {
    const hashedPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : undefined;
    const updatedUser = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...updateUserDto,
          password: hashedPassword ? hashedPassword : undefined,
        },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return updatedUser;
  }

  // Delete user by ID
  async deleteUser(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new UnauthorizedException('User not found');
    }

    return { message: 'User deleted successfully' };
  }

  /////////////////////////login
  //////////// Login

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user = await this.findByEmail(email);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Log to debug
    console.log('Password to compare:', password);
    console.log('Hashed password from DB:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Log the result of password comparison
    console.log('Is password valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, role: user.role };
    const token = this.jwtService.sign(payload); // Sign the payload to generate token

    return token;
  }
}
