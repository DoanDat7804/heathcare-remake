import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.userModel.findOne({
      $or: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
    });
    if (existingUser) {
      throw new BadRequestException('Email or phone already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10).catch(() => {
      throw new BadRequestException('Error hashing password');
    });

    // Chuyển đổi dateOfBirth từ string sang Date
    const userData = {
      ...createUserDto,
      password: hashedPassword,
      dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : undefined,
    };

    const newUser = new this.userModel(userData);
    const savedUser = await newUser.save();
    return plainToInstance(UserResponseDto, savedUser.toObject());
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    if (updateUserDto.email || updateUserDto.phone) {
      const existingUser = await this.userModel.findOne({
        $or: [{ email: updateUserDto.email }, { phone: updateUserDto.phone }],
        _id: { $ne: id },
      });
      if (existingUser) {
        throw new BadRequestException('Email or phone already exists');
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10).catch(() => {
        throw new BadRequestException('Error hashing password');
      });
    }

    // Chuyển đổi dateOfBirth từ string sang Date
    if (updateUserDto.dateOfBirth) {
      updateUserDto.dateOfBirth = new Date(updateUserDto.dateOfBirth) as any;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .lean()
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToInstance(UserResponseDto, updatedUser);
  }

  // Các phương thức khác giữ nguyên
  async findAll(page: number = 1, limit: number = 10): Promise<UserResponseDto[]> {
    const skip = (page - 1) * limit;
    const users = await this.userModel.find().skip(skip).limit(limit).lean().exec();
    return plainToInstance(UserResponseDto, users);
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(id).lean().exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToInstance(UserResponseDto, user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}