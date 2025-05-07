// src/score/score.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { Score, ScoreSchema } from './score.schema';
import { User, UserSchema } from '../user/user.schema';
import { Response, ResponseSchema } from '../response/response.schema';
import { Question, QuestionSchema } from '../question/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Score.name, schema: ScoreSchema },
      { name: User.name, schema: UserSchema },
      { name: Response.name, schema: ResponseSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  providers: [ScoreService],
  controllers: [ScoreController],
})
export class ScoreModule {}
