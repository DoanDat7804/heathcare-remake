import { IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';

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

  @IsString()
  role: string;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  @IsOptional()
  avatar?: string | null; 
}