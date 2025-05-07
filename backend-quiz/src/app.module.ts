import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuestionModule } from './question/question.module';
import { ResponseModule } from './response/response.module';
import { ResultModule } from './result/result.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ahmedkazdar:ahmed@cluster0.qyu9hzf.mongodb.net/Quiz?retryWrites=true&w=majority&appName=Cluster0',
    ),
    UserModule,
    AuthModule,
    QuestionModule,
    ResponseModule,
    ResultModule,
    ScoreModule,
  ],
})
export class AppModule {}
