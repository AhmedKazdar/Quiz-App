import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { OnlineModule } from 'src/gateways/online.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // User model available here
    JwtModule.register({
      secret: '123456',
      signOptions: { expiresIn: '10d' },
    }),
    OnlineModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, MongooseModule], // Export MongooseModule so other modules can use UserModel
})
export class UserModule {}
