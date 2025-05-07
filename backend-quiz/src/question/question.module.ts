import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { ResponseModule } from '../response/response.module'; // Import the ResponseModule
import { ResponseService } from '../response/response.service'; // Ensure ResponseService is imported
import { QuestionSchema } from './question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionSchema }]),
    forwardRef(() => ResponseModule), // Use forwardRef here when importing ResponseModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [MongooseModule], // No need for forwardRef in providers here
})
export class QuestionModule {}
