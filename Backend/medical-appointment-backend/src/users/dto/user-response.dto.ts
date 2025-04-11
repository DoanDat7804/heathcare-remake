// src/users/dto/user-response.dto.ts
import { IsString, IsBoolean, IsOptional, IsDate, Matches, IsISO8601 } from 'class-validator';

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

  @IsISO8601() // Thay @IsDate() bằng @IsISO8601()
  @IsOptional()
  dateOfBirth?: string; // Chuyển sang string để nhận chuỗi ISO

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