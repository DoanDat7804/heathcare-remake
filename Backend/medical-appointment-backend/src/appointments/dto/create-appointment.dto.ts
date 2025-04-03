import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  // @IsString()
  // @IsNotEmpty()
  // patientId: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @IsDateString()
  @IsNotEmpty()
  date: string; // Đổi từ Date sang string

  @IsString()
  @IsNotEmpty()
  timeSlot: string;

  symptoms?: string[];
}