import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorResponseDto } from './dto/doctor-response.dto';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    if (createDoctorDto.email) {
      const existingDoctorByEmail = await this.doctorModel.findOne({ email: createDoctorDto.email });
      if (existingDoctorByEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (createDoctorDto.phone) {
      const existingDoctorByPhone = await this.doctorModel.findOne({ phone: createDoctorDto.phone });
      if (existingDoctorByPhone) {
        throw new BadRequestException('Phone already exists');
      }
    }

    const createdDoctor = new this.doctorModel({
      ...createDoctorDto,
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
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return this.mapToResponseDto(doctor);
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<DoctorResponseDto> {
    if (updateDoctorDto.email) {
      const existingDoctorByEmail = await this.doctorModel.findOne({ email: updateDoctorDto.email });
      if (existingDoctorByEmail && existingDoctorByEmail._id.toString() !== id) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (updateDoctorDto.phone) {
      const existingDoctorByPhone = await this.doctorModel.findOne({ phone: updateDoctorDto.phone });
      if (existingDoctorByPhone && existingDoctorByPhone._id.toString() !== id) {
        throw new BadRequestException('Phone already exists');
      }
    }

    const updatedDoctor = await this.doctorModel
      .findByIdAndUpdate(id, updateDoctorDto, { new: true })
      .exec();
    if (!updatedDoctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return this.mapToResponseDto(updatedDoctor);
  }

  async remove(id: string): Promise<void> {
    const result = await this.doctorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
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
      isActive: doctor.isActive,
    };
  }
}