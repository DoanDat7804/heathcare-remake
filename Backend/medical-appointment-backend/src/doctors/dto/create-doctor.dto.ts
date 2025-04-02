import { IsString, IsEmail, IsOptional } from 'class-validator';

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

  @IsString()
  @IsOptional() // Role là tùy chọn, mặc định là 'doctor'
  role?: string;
}