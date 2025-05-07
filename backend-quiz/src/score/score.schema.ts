import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId, Types } from 'mongoose';

export type ScoreDocument = Score & Document;

@Schema()
export class Score {
  @Prop({ required: true })
  score: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // Link this to User somehow, e.g., using userId (or ObjectId if it's a ref)

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ScoreSchema = SchemaFactory.createForClass(Score);
