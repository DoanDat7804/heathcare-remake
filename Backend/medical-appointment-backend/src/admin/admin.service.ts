import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { DoctorsService } from '../doctors/doctors.service';
import { NewsService } from '../news/news.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { CreateDoctorDto } from '../doctors/dto/create-doctor.dto';
import { UpdateDoctorDto } from '../doctors/dto/update-doctor.dto';
import { CreateNewsDto } from '../news/dto/create-news.dto';
import { UpdateNewsDto } from '../news/dto/update-news.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly doctorsService: DoctorsService,
    private readonly newsService: NewsService,
  ) {}

  // Quản lý Users
  async getAllUsers() {
    return this.usersService.findAll();
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  async deleteUser(id: string) {
    return this.usersService.remove(id);
  }

  // Quản lý Doctors
  async getAllDoctors() {
    return this.doctorsService.findAll();
  }

  async createDoctor(createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  async updateDoctor(id: string, updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  async deleteDoctor(id: string) {
    return this.doctorsService.remove(id);
  }

  // Quản lý News
  async getAllNews() {
    return this.newsService.findAll();
  }

  async createNews(createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  async updateNews(id: string, updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(id, updateNewsDto);
  }

  async deleteNews(id: string) {
    return this.newsService.remove(id);
  }
}