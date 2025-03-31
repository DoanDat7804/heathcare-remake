import { IsString, IsEmail, IsOptional, IsISO8601, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @Matches(/^(0[1-9][0-9]{8})$/, { message: 'phone must be a valid Vietnamese phone number (e.g., 0987654321)' })
  phone: string;

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
}