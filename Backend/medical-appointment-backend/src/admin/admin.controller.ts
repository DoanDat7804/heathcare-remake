// src/admin/admin.controller.ts
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
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Quản lý Users
  @Get('users')
  getAllUsers(): Promise<UserResponseDto[]> {
    return this.adminService.getAllUsers();
  }

  @Post('users')
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.adminService.createUser(createUserDto);
  }

  @Patch('users/:id')
  updateUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.adminService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.adminService.deleteUser(id);
  }

  // Quản lý Doctors
  @Get('doctors')
  getAllDoctors(): Promise<any[]> {
    return this.adminService.getAllDoctors();
  }

  @Post('doctors')
  createDoctor(@Body() createDoctorDto: CreateDoctorDto): Promise<any> {
    return this.adminService.createDoctor(createDoctorDto);
  }

  @Patch('doctors/:id')
  updateDoctor(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<any> {
    return this.adminService.updateDoctor(id, updateDoctorDto);
  }

  @Delete('doctors/:id')
  deleteDoctor(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.adminService.deleteDoctor(id);
  }

  // Quản lý News
  @Get('news')
  getAllNews(): Promise<any[]> {
    return this.adminService.getAllNews();
  }

  @Post('news')
  createNews(@Body() createNewsDto: CreateNewsDto): Promise<any> {
    return this.adminService.createNews(createNewsDto);
  }

  @Patch('news/:id')
  updateNews(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ): Promise<any> {
    return this.adminService.updateNews(id, updateNewsDto);
  }

  @Delete('news/:id')
  deleteNews(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.adminService.deleteNews(id);
  }

  // Quản lý Appointments
  @Get('appointments')
  getAllAppointments(): Promise<any[]> {
    return this.adminService.getAllAppointments();
  }

  @Patch('appointments/:id')
  updateAppointment(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<any> {
    return this.adminService.updateAppointment(id, updateAppointmentDto);
  }

  @Delete('appointments/:id')
  deleteAppointment(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.adminService.deleteAppointment(id);
  }
}