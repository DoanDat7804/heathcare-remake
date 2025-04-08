// src/dialogflow/dialogflow.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { DoctorsService } from '../doctors/doctors.service';
import { DoctorDocument } from '../doctors/schemas/doctor.schema';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';

@Injectable()
export class DialogflowService {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly doctorsService: DoctorsService,
  ) {}

  async findDoctorByName(name: string): Promise<DoctorDocument | null> {
    return this.doctorsService.findDoctorByName(name);
  }

  async findDoctorsBySpecialty(specialty: string): Promise<DoctorDocument[]> {
    return this.doctorsService.findDoctorsBySpecialty(specialty);
  }

  async findDoctorsByGender(gender: string): Promise<DoctorDocument[]> {
    return this.doctorsService.findDoctorsByGender(gender);
  }

  async getSpecialtyBySymptoms(symptoms: string[]): Promise<string> {
    const symptomToSpecialty: Record<string, string> = {
      'phát ban': 'Da liễu',
      'đau họng': 'Tai mũi họng',
      'sốt': 'Nội khoa',
      'đau đầu': 'Thần kinh',
      'ho': 'Hô hấp',
      'buồn nôn': 'Tiêu hóa',
      'mệt mỏi': 'Nội tổng quát',
      'khó thở': 'Hô hấp',
    };

    for (const symptom of symptoms) {
      if (symptomToSpecialty[symptom]) {
        return symptomToSpecialty[symptom];
      }
    }
    return 'Nội tổng quát';
  }

  async checkAvailability(doctorId: string, date: string, timeSlot: string): Promise<boolean> {
    const appointments = await this.appointmentsService.findByDoctor(doctorId);
    // Chuyển date thành định dạng ISO để so sánh
    const formattedDate = new Date(date).toISOString().split('T')[0];
    // Điều chỉnh timeSlot thành định dạng HH:MM-HH:MM nếu cần
    const formattedTimeSlot = timeSlot.includes('-') ? timeSlot : `${timeSlot}-${parseInt(timeSlot.split(':')[0]) + 1}:00`;
    return !appointments.some(
      (appt) => appt.date.toISOString().split('T')[0] === formattedDate && appt.timeSlot === formattedTimeSlot,
    );
  }

  async classifyInput(input: string): Promise<{ symptoms: string[]; doctorName?: string }> {
    const symptomsList = [
      'phát ban', 'đau họng', 'sốt', 'đau đầu', 'ho', 'buồn nôn', 'mệt mỏi', 'khó thở',
    ];
    const doctors = await this.doctorsService.findAll();
    const doctorNames = doctors.map((d) => d.name.toLowerCase());

    const words = input.toLowerCase().split(' ');
    const symptoms = words.filter((word) => symptomsList.includes(word));
    const doctorName = words.find((word) => doctorNames.includes(word));

    return { symptoms, doctorName };
  }

  async bookAppointment(
    patientId: string,
    doctorId: string,
    date: string,
    timeSlot: string,
    symptoms: string[],
  ): Promise<{ success: boolean; message?: string }> {
    const createAppointmentDto: CreateAppointmentDto = {
      patientId,
      doctorId,
      date, // Định dạng: YYYY-MM-DD
      timeSlot: timeSlot.includes('-') ? timeSlot : `${timeSlot}-${parseInt(timeSlot.split(':')[0]) + 1}:00`, // Đảm bảo HH:MM-HH:MM
      symptoms,
      serviceType: 'consultation',
    };

    try {
      const user = { userId: patientId, role: 'patient' }; // Tạo user object cho AppointmentsService
      await this.appointmentsService.create(createAppointmentDto, user);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message || 'Có lỗi xảy ra khi đặt lịch.' };
    }
  }
}