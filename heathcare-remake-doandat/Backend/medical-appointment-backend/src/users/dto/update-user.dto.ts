import { IsString, IsEmail, IsOptional, IsBoolean, IsISO8601, Matches } from 'class-validator';

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

  @IsISO8601()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  gender?: string; // Giới tính giờ là string, không dùng enum

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

  @IsString()
  @IsOptional()
  role?: string; // Role giờ chỉ là string, không giới hạn enum
}