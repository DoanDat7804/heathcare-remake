import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { DoctorSchema } from '../doctors/schemas/doctor.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'Doctor', schema: DoctorSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        console.log('JWT_SECRET in JwtModule:', process.env.JWT_SECRET);
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET không được định nghĩa trong biến môi trường');
        }
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}