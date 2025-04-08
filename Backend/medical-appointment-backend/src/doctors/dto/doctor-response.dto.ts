// src/doctors/dto/doctor-response.dto.ts
import { IsString, IsEmail, IsInt, IsArray, IsOptional, IsBoolean, ValidateNested} from 'class-validator';

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
  _id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

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
  @IsOptional()
  hospital?: HospitalDto;

  @IsString()
  role: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsOptional()
  avatar?: string | null;
}