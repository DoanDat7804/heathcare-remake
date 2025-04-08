// src/doctors/dto/update-doctor.dto.ts
import { IsString, IsEmail, IsInt, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
  specialty?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsInt()
  @IsOptional()
  experience?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ValidateNested()
  @Type(() => HospitalUpdateDto)
  @IsOptional()
  hospital?: HospitalUpdateDto;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}