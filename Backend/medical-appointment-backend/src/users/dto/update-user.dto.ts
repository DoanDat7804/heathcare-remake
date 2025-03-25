// src/users/dto/update-user.dto.ts
import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsBoolean, IsDate } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsOptional()
  address?: {
    street: string;
    district: string;
    city: string;
    country: string;
  };

  @IsOptional()
  healthInfo?: {
    bloodType: string;
    allergies: string[];
    chronicDiseases: string[];
    currentMedications: string[];
  };

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}