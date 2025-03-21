import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel('Doctor') private doctorModel: Model<Doctor>) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);
    const newDoctor = new this.doctorModel({
      ...createDoctorDto,
      password: hashedPassword,
    });
    return newDoctor.save();
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async findOne(id: string): Promise<Doctor | null> {
    return this.doctorModel.findById(id).exec();
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor | null> {
    if (updateDoctorDto.password) {
      updateDoctorDto.password = await bcrypt.hash(updateDoctorDto.password, 10);
    }
    return this.doctorModel.findByIdAndUpdate(id, updateDoctorDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Doctor | null> {
    return this.doctorModel.findByIdAndDelete(id).exec();
  }
  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
    return hashedPassword;
  }
}