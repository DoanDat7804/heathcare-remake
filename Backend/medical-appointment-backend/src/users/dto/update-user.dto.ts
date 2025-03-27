// src/users/dto/update-user.dto.ts
import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsBoolean, IsDate, IsEnum, IsISO8601, Matches } from 'class-validator';

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

  @Matches(/^(0[1-9][0-9]{8})$/, { message: 'phone must be a valid Vietnamese phone number (e.g., 0987654321)' })
  @IsOptional()
  phone?: string;

  @IsISO8601() // Thay @IsDate() bằng @IsISO8601()
  @IsOptional()
  dateOfBirth?: string; // Chuyển sang string để nhận chuỗi ISO

  @IsString()
  @IsOptional()
  @IsEnum(['Nam', 'Nữ', 'Khác'])
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