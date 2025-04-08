// src/appointments/dto/appointment-response.dto.ts
import { Expose, Type } from 'class-transformer';

export class AppointmentResponseDto {
  @Expose()
  _id: string;

  @Expose()
  patientId: string;

  @Expose()
  doctorId: string;

  @Expose()
  serviceType: string;

  @Expose()
  date: string;

  @Expose()
  timeSlot: string;

  @Expose()
  status: string;

  @Expose()
  note?: string;

  @Expose()
  priority?: number;

  @Expose()
  isPrepaid?: boolean;

  @Expose()
  confirmationDate?: string;

  @Expose()
  rejectionReason?: string;

  @Expose()
  doctorNote?: string;

  @Expose()
  notificationSent?: boolean;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}