// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({ ...createUserDto, password: hashedPassword });
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User  | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
// Cách này phù hợp nếu bạn muốn xử lý lỗi một cách rõ ràng trong ứng dụng.
// import { NotFoundException } from '@nestjs/common';

// async findOne(id: string): Promise<User> {
//   const user = await this.userModel.findById(id).exec();
//   if (!user) {
//     throw new NotFoundException(`User with ID ${id} not found`);
//   }
//   return user;
// }

// async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
//   const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
//   if (!updatedUser) {
//     throw new NotFoundException(`User with ID ${id} not found`);
//   }
//   return updatedUser;
// }

// async remove(id: string): Promise<User> {
//   const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
//   if (!deletedUser) {
//     throw new NotFoundException(`User with ID ${id} not found`);
//   }
//   return deletedUser;
// }