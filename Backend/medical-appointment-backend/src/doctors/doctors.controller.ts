import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import {DoctorResponseDto} from '../doctors/dto/doctor-response.dto';


@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post('hash-password')
  async hashPassword(@Body('password') password: string) {
    return this.doctorsService.hashPassword(password);
  }
  
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    return this.doctorsService.create(createDoctorDto);
  }
  
  @Get()
  findAll(): Promise<DoctorResponseDto[]> {
    return this.doctorsService.findAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string): Promise<DoctorResponseDto> {
    return this.doctorsService.findOne(id);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<DoctorResponseDto> {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
}