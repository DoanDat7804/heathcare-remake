// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Đăng nhập chung cho tất cả vai trò
  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const result = await this.authService.login(loginDto.email, loginDto.password);
      return result;
    } catch (error) {
      throw new UnauthorizedException('Đăng nhập thất bại');
    }
  }

  // Đăng nhập riêng cho admin
  @Post('admin/login')
  async adminLogin(@Body() loginDto: { email: string; password: string }) {
    try {
      const result = await this.authService.adminLogin(loginDto.email, loginDto.password);
      return result;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Đăng nhập admin thất bại');
    }
  }

  // Đăng ký user
  @Post('register')
  async register(@Body() userDto: any) {
    return this.authService.register(userDto);
  }
}