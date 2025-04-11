// src/doctors/doctors.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel('Doctor') private doctorModel: Model<Doctor>) {}

  // Hàm ánh xạ từ Doctor document sang DoctorResponseDto
  private toDoctorResponseDto(doctor: any): DoctorResponseDto {
    return {
      id: doctor._id.toString(), // Chuyển _id thành id kiểu string
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender,
      specialty: doctor.specialty,
      experience: doctor.experience,
      languages: doctor.languages,
      hospital: doctor.hospital
        ? {
            name: doctor.hospital.name,
            address: doctor.hospital.address,
            department: doctor.hospital.department,
          }
        : undefined,
      avatar: doctor.avatar,
      isActive: doctor.isActive,
      role: doctor.role,
    };
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);
    const newDoctor = new this.doctorModel({
      ...createDoctorDto,
      password: hashedPassword,
    });
    const savedDoctor = await newDoctor.save();
    return this.toDoctorResponseDto(savedDoctor);
  }

  async findAll(): Promise<DoctorResponseDto[]> {
    const doctors = await this.doctorModel.find().exec();
    return doctors.map((doctor) => this.toDoctorResponseDto(doctor));
  }

  async findOne(id: string): Promise<DoctorResponseDto> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) throw new NotFoundException(`Doctor with ID ${id} not found`);
    return this.toDoctorResponseDto(doctor);
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<DoctorResponseDto> {
    if (updateDoctorDto.password) {
      updateDoctorDto.password = await bcrypt.hash(updateDoctorDto.password, 10);
    }
    const updatedDoctor = await this.doctorModel
      .findByIdAndUpdate(id, { $set: updateDoctorDto }, { new: true })
      .exec();
    if (!updatedDoctor) throw new NotFoundException(`Doctor with ID ${id} not found`);
    return this.toDoctorResponseDto(updatedDoctor);
  }

  async remove(id: string): Promise<DoctorResponseDto> {
    const deletedDoctor = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!deletedDoctor) throw new NotFoundException(`Doctor with ID ${id} not found`);
    return this.toDoctorResponseDto(deletedDoctor);
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
    return hashedPassword;
  }

  async findBySpecialty(specialty: string): Promise<DoctorResponseDto[]> {
    const keyword = specialty.trim().normalize('NFC');
    const doctors = await this.doctorModel.find({
      specialty: { $regex: keyword, $options: 'i' }
    }).exec();
  
    if (!doctors || doctors.length === 0) {
      const allDoctors = await this.doctorModel.find().exec();
      console.log('Available specialties:', allDoctors.map(d => d));
    }
  
    return doctors.map((doctor) => this.toDoctorResponseDto(doctor));
  }
  
  

}