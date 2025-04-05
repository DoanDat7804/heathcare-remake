import { IsString, IsEmail, IsOptional, IsISO8601, Matches, IsEnum } from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  PATIENT = 'patient',
}

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
  gender?: string;

  @IsOptional()
  address?: { street: string; district: string; city: string; country: string };

  @IsOptional()
  healthInfo?: { bloodType: string; allergies: string[]; chronicDiseases: string[]; currentMedications: string[] };

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; 
}