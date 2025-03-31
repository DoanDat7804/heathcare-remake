import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Doctor } from '../doctors/schemas/doctor.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Doctor') private doctorModel: Model<Doctor>,
    private jwtService: JwtService,
  ) {}

  // Hàm xác thực chung cho cả User và Doctor
  async validateUser(email: string, password: string): Promise<any> {
    let user = await this.userModel.findOne({ email });
    if (!user) {
      user = await this.doctorModel.findOne({ email });
    }
    if (!user) {
      throw new UnauthorizedException('Email không tồn tại');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }
    const { password: pwd, ...result } = user.toObject();
    return result;
  }

  // Đăng nhập chung (dành cho tất cả vai trò)
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Đăng nhập riêng cho admin
  async adminLogin(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Chỉ admin mới có thể đăng nhập bằng cách này');
    }
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Đăng ký user (mặc định role là patient)
  async register(userDto: any) {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = new this.userModel({
      ...userDto,
      password: hashedPassword,
      role: userDto.role || 'patient', // Mặc định là patient nếu không chỉ định
    });
    return newUser.save();
  }
}