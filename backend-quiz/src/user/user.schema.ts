import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true }) // ensure username is unique
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  role: string;

  @Prop({ required: true, unique: true }) // ensure phone number is unique
  phoneNumber: string;

  @Prop({ required: true, unique: true }) // ensure email is unique
  email: string;

  @Prop({ default: () => new Date() }) // automatically set creation date
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
