// src/dialogflow/dialogflow.service.ts
import { Injectable } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { Doctor } from '../doctors/schemas/doctor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {CreateAppointmentDto} from '../appointments/dto/create-appointment.dto';

@Injectable()
export class DialogflowService {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
  ) {}

  async findDoctorByName(name: string): Promise<Doctor | null> {
    return this.doctorModel.findOne({ name, isActive: true }).exec();
  }

  // Tìm chuyên khoa dựa trên triệu chứng
  async getSpecialtyBySymptoms(symptoms: string[]): Promise<string> {
    // Ánh xạ đơn giản giữa triệu chứng và chuyên khoa (có thể mở rộng trong DB sau)
    const symptomToSpecialty = {
      'phát ban': 'Da liễu',
      'đau họng': 'Tai mũi họng',
      'sốt': 'Nội tổng quát',
      'đau đầu': 'Thần kinh',
    };

    for (const symptom of symptoms) {
      if (symptomToSpecialty[symptom]) {
        return symptomToSpecialty[symptom];
      }
    }
    return 'Nội tổng quát'; // Mặc định nếu không khớp
  }

  // Tìm bác sĩ theo chuyên khoa
  async findDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return this.doctorModel.find({ specialty, isActive: true }).exec();
  }

  // Kiểm tra lịch trống của bác sĩ
  async checkAvailability(doctorId: string, date: string, timeSlot: string): Promise<boolean> {
    const existingAppointment = await this.appointmentsService.findByDoctor(doctorId);
    return !existingAppointment.some(
      (appt) => appt.date.toISOString().split('T')[0] === date && appt.timeSlot === timeSlot,
    );
  }

  // Đặt lịch hẹn
  // src/dialogflow/dialogflow.service.ts
async bookAppointment(
  patientId: string,
  doctorId: string,
  date: string,
  timeSlot: string,
  symptoms: string[],
): Promise<boolean> {
  const createAppointmentDto: CreateAppointmentDto = {
    doctorId,
    date,
    timeSlot,
    symptoms,
    serviceType: 'consultation', // Thêm giá trị mặc định nếu cần
  };

  try {
    const user = { userId: patientId, role: 'patient' };
    await this.appointmentsService.create(createAppointmentDto, user);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
}