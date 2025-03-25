// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DoctorsService } from '../doctors/doctors.service';
import { NewsService } from '../news/news.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { CreateDoctorDto } from '../doctors/dto/create-doctor.dto';
import { UpdateDoctorDto } from '../doctors/dto/update-doctor.dto';
import { CreateNewsDto } from '../news/dto/create-news.dto';
import { UpdateNewsDto } from '../news/dto/update-news.dto';
import { UpdateAppointmentDto } from '../appointments/dto/update-appointment.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly doctorsService: DoctorsService,
    private readonly newsService: NewsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  // Quản lý Users
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  async deleteUser(id: string): Promise<void> {
    return this.usersService.remove(id);
  }

   // Quản lý Doctors
   async getAllDoctors(): Promise<any[]> { // Thay bằng DoctorResponseDto nếu có
    return this.doctorsService.findAll();
  }

  async createDoctor(createDoctorDto: CreateDoctorDto): Promise<any> { // Thay bằng DoctorResponseDto nếu có
    return this.doctorsService.create(createDoctorDto);
  }

  async updateDoctor(id: string, updateDoctorDto: UpdateDoctorDto): Promise<any> { // Thay bằng DoctorResponseDto nếu có
    const updatedDoctor = await this.doctorsService.update(id, updateDoctorDto);
    if (!updatedDoctor) throw new NotFoundException(`Doctor with ID ${id} not found`);
    return updatedDoctor;
  }

  async deleteDoctor(id: string): Promise<void> {
    const result = await this.doctorsService.remove(id);
    if (!result) throw new NotFoundException(`Doctor with ID ${id} not found`);
  }

  // Quản lý News
  async getAllNews(): Promise<any[]> { // Thay bằng NewsResponseDto nếu có
    return this.newsService.findAll();
  }

  async createNews(createNewsDto: CreateNewsDto): Promise<any> { // Thay bằng NewsResponseDto nếu có
    return this.newsService.create(createNewsDto);
  }

  async updateNews(id: string, updateNewsDto: UpdateNewsDto): Promise<any> { // Thay bằng NewsResponseDto nếu có
    const updatedNews = await this.newsService.update(id, updateNewsDto);
    if (!updatedNews) throw new NotFoundException(`News with ID ${id} not found`);
    return updatedNews;
  }

  async deleteNews(id: string): Promise<void> {
    const result = await this.newsService.remove(id);
    if (!result) throw new NotFoundException(`News with ID ${id} not found`);
  }

  // Quản lý Appointments
  async getAllAppointments(): Promise<any[]> { // Thay bằng AppointmentResponseDto nếu có
    return this.appointmentsService.findAll();
  }

  async updateAppointment(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<any> { // Thay bằng AppointmentResponseDto nếu có
    const updatedAppointment = await this.appointmentsService.update(id, updateAppointmentDto);
    if (!updatedAppointment) throw new NotFoundException(`Appointment with ID ${id} not found`);
    return updatedAppointment;
  }

  async deleteAppointment(id: string): Promise<void> {
    const result = await this.appointmentsService.remove(id);
    if (!result) throw new NotFoundException(`Appointment with ID ${id} not found`);
  }

}
