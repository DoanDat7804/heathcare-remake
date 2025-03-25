// src/users/dto/user-response.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UserResponseDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  role: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
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
}