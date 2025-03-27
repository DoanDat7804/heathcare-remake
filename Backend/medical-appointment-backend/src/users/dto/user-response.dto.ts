// src/users/dto/user-response.dto.ts
import { IsString, IsBoolean, IsOptional, IsDate, Matches } from 'class-validator';

export class UserResponseDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @Matches(/^(0[1-9][0-9]{8})$/, { message: 'phone must be a valid Vietnamese phone number (e.g., 0987654321)' })
  phone: string;

  @IsString()
  role: string;

  @IsBoolean()
  isActive: boolean;

  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

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