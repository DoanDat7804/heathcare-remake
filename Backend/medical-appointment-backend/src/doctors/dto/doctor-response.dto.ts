// src/doctors/dto/doctor-response.dto.ts
import { IsString, IsEmail, IsInt, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class HospitalDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  department?: string;
}

export class DoctorResponseDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  gender: string;

  @IsString()
  specialty: string;

  @IsInt()
  experience: number;

  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @IsOptional()
  hospital?: HospitalDto;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  role: string;
}