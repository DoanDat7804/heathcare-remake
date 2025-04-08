// src/doctors/doctors.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentDoctor(@Req() req): Promise<DoctorResponseDto> {
    const doctorId = req.user.sub;
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

  @Post(':id/upload-avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Chỉ hỗ trợ file ảnh (jpg, jpeg, png, gif)!'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
  }))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DoctorResponseDto> {
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    const updateDto: UpdateDoctorDto = { avatar: avatarUrl };
    return this.doctorsService.update(id, updateDto);
  }
}