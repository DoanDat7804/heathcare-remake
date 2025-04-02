import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Thêm AuthGuard
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post('hash-password')
  async hashPassword(@Body('password') password: string): Promise<string> {
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

  // Thêm endpoint /doctors/me
  @Get('me')
  @UseGuards(AuthGuard('jwt')) // Bảo vệ route bằng JWT
  async getCurrentDoctor(@Req() req): Promise<DoctorResponseDto> {
    const doctorId = req.user.sub; // Lấy ID từ token JWT
    return this.doctorsService.findOne(doctorId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<DoctorResponseDto> {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.doctorsService.remove(id);
  }
}