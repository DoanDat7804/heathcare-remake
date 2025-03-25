import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../shared/guards/role.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateDoctorDto } from '../doctors/dto/create-doctor.dto';
import { UpdateDoctorDto } from '../doctors/dto/update-doctor.dto';
import { CreateNewsDto } from '../news/dto/create-news.dto';
import { UpdateNewsDto } from '../news/dto/update-news.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Quản lý Users
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.adminService.createUser(createUserDto);
  }

  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Quản lý Doctors
  @Get('doctors')
  getAllDoctors() {
    return this.adminService.getAllDoctors();
  }

  @Post('doctors')
  createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.adminService.createDoctor(createDoctorDto);
  }

  @Patch('doctors/:id')
  updateDoctor(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.adminService.updateDoctor(id, updateDoctorDto);
  }

  @Delete('doctors/:id')
  deleteDoctor(@Param('id') id: string) {
    return this.adminService.deleteDoctor(id);
  }

  // Quản lý News
  @Get('news')
  getAllNews() {
    return this.adminService.getAllNews();
  }

  @Post('news')
  createNews(@Body() createNewsDto: CreateNewsDto) {
    return this.adminService.createNews(createNewsDto);
  }

  @Patch('news/:id')
  updateNews(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.adminService.updateNews(id, updateNewsDto);
  }

  @Delete('news/:id')
  deleteNews(@Param('id') id: string) {
    return this.adminService.deleteNews(id);
  }

  // Lấy tất cả lịch hẹn
  @Get('appointments')
  getAllAppointments() {
    return this.adminService.getAllAppointments();
  }

  // Cập nhật lịch hẹn
  @Patch('appointments/:id')
  updateAppointment(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.adminService.updateAppointment(id, updateAppointmentDto);
  }

  // Xóa lịch hẹn
  @Delete('appointments/:id')
  deleteAppointment(@Param('id') id: string) {
    return this.adminService.deleteAppointment(id);
  }
}