import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Response, ResponseSchema } from './response.schema';
import { ResponseController } from './response.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Response.name, schema: ResponseSchema },
    ]), // Ensure the Response schema is added
  ],
  providers: [ResponseService],
  controllers: [ResponseController],
  exports: [ResponseService], // Ensure ResponseService is exported to be used in other modules
})
export class ResponseModule {}
