import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'name of the user',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'phoneNumber of the user',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin']) // Ensures only 'user' or 'admin' are valid roles
  role: string;
}
