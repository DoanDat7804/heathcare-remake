// src/doctors/dto/create-doctor.dto.ts
import { IsString, IsEmail, IsInt, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class HospitalDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  department?: string;
}

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  specialty: string;

  @IsString()
  gender: string;

  @IsInt()
  experience: number;

  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ValidateNested()
  @Type(() => HospitalDto)
  @IsOptional()
  hospital?: HospitalDto;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}