import { IsOptional, IsString, IsDateString, IsEnum, IsNumber, IsBoolean } from 'class-validator';

export class UpdateAppointmentDto {

  @IsOptional()
  @IsString()
  doctorId?: string; 
  
  @IsOptional()
  @IsString()
  serviceType?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  timeSlot?: string;

  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled', 'rejected'])
  status?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  isPrepaid?: boolean;

  @IsOptional()
  @IsDateString()
  confirmationDate?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  doctorNote?: string;

  @IsOptional()
  @IsBoolean()
  notificationSent?: boolean;
}