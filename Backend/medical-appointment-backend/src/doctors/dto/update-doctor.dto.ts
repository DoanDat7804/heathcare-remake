// src/doctors/dto/update-doctor.dto.ts
import { IsString, IsEmail, IsInt, IsArray, IsOptional } from 'class-validator';

export class HospitalUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  department?: string;
}

export class UpdateDoctorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsInt()
  @IsOptional()
  experience?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @IsOptional()
  hospital?: HospitalUpdateDto;

  @IsString()
  @IsOptional()
  avatar?: string;
}