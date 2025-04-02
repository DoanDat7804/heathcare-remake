import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose'; // Thêm dòng này
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller'; // Thêm nếu chưa có
import { User, UserSchema } from '../users/schemas/user.schema'; // Nhập schema User
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema'; // Nhập schema Doctor

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: '4f8e5b6d9c7a12e3f4b89d5a6c7e8f9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
      signOptions: { expiresIn: '1h' },
    }),
    // Thêm MongooseModule.forFeature để cung cấp model User và Doctor
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Doctor', schema: DoctorSchema },
    ]),
  ],
  controllers: [AuthController], // Đảm bảo controller được thêm vào
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}