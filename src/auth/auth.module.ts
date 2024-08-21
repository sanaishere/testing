import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './Model/user.model';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports:[MongooseModule.forFeature([{name:User.name,schema:userSchema}]),
  JwtModule.register({
    secret:process.env.JWT_SECRET,
    signOptions:{expiresIn:'2h'}
    
  })],
  providers: [AuthService],
  controllers: [AuthController],
  exports:[JwtModule,AuthService]
})
export class AuthModule {}
