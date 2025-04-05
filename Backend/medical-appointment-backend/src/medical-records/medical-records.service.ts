import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicalRecord } from './schemas/medical-record.schema';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(@InjectModel('MedicalRecord') private medicalRecordModel: Model<MedicalRecord>) {}

  async create(createMedicalRecordDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    const newRecord = new this.medicalRecordModel(createMedicalRecordDto);
    return newRecord.save();
  }

  async findAll(): Promise<MedicalRecord[]> {
    return this.medicalRecordModel.find().exec();
  }

  async findOne(id: string): Promise<MedicalRecord | null> {
    return this.medicalRecordModel.findById(id).exec();
  }

  async update(id: string, updateMedicalRecordDto: UpdateMedicalRecordDto): Promise<MedicalRecord | null> {
    return this.medicalRecordModel.findByIdAndUpdate(id, updateMedicalRecordDto, { new: true }).exec();
  }

  async remove(id: string): Promise<MedicalRecord | null> {
    return this.medicalRecordModel.findByIdAndDelete(id).exec();
  }
}