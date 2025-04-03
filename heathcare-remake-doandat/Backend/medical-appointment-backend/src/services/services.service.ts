import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(@InjectModel('Service') private serviceModel: Model<Service>) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const newService = new this.serviceModel(createServiceDto);
    return newService.save();
  }

  async findAll(): Promise<Service[]> {
    return this.serviceModel.find().exec();
  }

  async findOne(id: string): Promise<Service | null> {
    return this.serviceModel.findById(id).exec();
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service | null> {
    return this.serviceModel.findByIdAndUpdate(id, updateServiceDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Service | null> {
    return this.serviceModel.findByIdAndDelete(id).exec();
  }
}