import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    if (createDoctorDto.email) {
      const existingDoctorByEmail = await this.doctorModel.findOne({ email: createDoctorDto.email });
      if (existingDoctorByEmail) {
        throw new BadRequestException('Email đã tồn tại');
      }
    }

    if (createDoctorDto.phone) {
      const existingDoctorByPhone = await this.doctorModel.findOne({ phone: createDoctorDto.phone });
      if (existingDoctorByPhone) {
        throw new BadRequestException('Số điện thoại đã tồn tại');
      }
    }

    if (createDoctorDto.password) {
      createDoctorDto.password = await this.hashPassword(createDoctorDto.password);
    }

    const createdDoctor = new this.doctorModel({
      ...createDoctorDto,
      role: createDoctorDto.role || 'doctor', // Mặc định là 'doctor' nếu không cung cấp
      isActive: true,
    });
    const savedDoctor = await createdDoctor.save();
    return this.mapToResponseDto(savedDoctor);
  }

  async findAll(): Promise<DoctorResponseDto[]> {
    const doctors = await this.doctorModel.find().exec();
    return doctors.map((doctor) => this.mapToResponseDto(doctor));
  }

  async findOne(id: string): Promise<DoctorResponseDto> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Bác sĩ với ID ${id} không tìm thấy`);
    }
    return this.mapToResponseDto(doctor);
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<DoctorResponseDto> {
    if (updateDoctorDto.email) {
      const existingDoctorByEmail = await this.doctorModel.findOne({ email: updateDoctorDto.email });
      if (existingDoctorByEmail && existingDoctorByEmail._id.toString() !== id) {
        throw new BadRequestException('Email đã tồn tại');
      }
    }

    if (updateDoctorDto.phone) {
      const existingDoctorByPhone = await this.doctorModel.findOne({ phone: updateDoctorDto.phone });
      if (existingDoctorByPhone && existingDoctorByPhone._id.toString() !== id) {
        throw new BadRequestException('Số điện thoại đã tồn tại');
      }
    }

    if (updateDoctorDto.password) {
      updateDoctorDto.password = await this.hashPassword(updateDoctorDto.password);
    }

    const updatedDoctor = await this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec();
    if (!updatedDoctor) {
      throw new NotFoundException(`Bác sĩ với ID ${id} không tìm thấy`);
    }
    return this.mapToResponseDto(updatedDoctor);
  }

  async remove(id: string): Promise<void> {
    const result = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Bác sĩ với ID ${id} không tìm thấy`);
    }
  }

  private mapToResponseDto(doctor: DoctorDocument): DoctorResponseDto {
    return {
      _id: doctor._id.toString(),
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialty: doctor.specialty,
      gender: doctor.gender,
      role: doctor.role,
      isActive: doctor.isActive,
    };
  }
}