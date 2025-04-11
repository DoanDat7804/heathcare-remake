import { Injectable, BadRequestException } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { Doctor } from '../doctors/schemas/doctor.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';

@Injectable()
export class DialogflowService {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
  ) {}

  // Tìm bác sĩ theo tên
  async findDoctorByName(name: string): Promise<Doctor | null> {
    return this.doctorModel.findOne({ name, isActive: true }).exec();
  }

  // Tìm bác sĩ theo chuyên khoa
  async findDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return this.doctorModel.find({ specialty, isActive: true }).exec();
  }

  // Tìm bác sĩ theo giới tính
  async findDoctorsByGender(gender: string): Promise<Doctor[]> {
    return this.doctorModel.find({ gender, isActive: true }).exec();
  }

  // Tìm chuyên khoa dựa trên triệu chứng
  async getSpecialtyBySymptoms(symptoms: string[]): Promise<string> {
    const symptomToSpecialty: Record<string, string> = {
      'phát ban': 'Da liễu',
      'đau họng': 'Tai mũi họng',
      'sốt': 'Nội tổng quát',
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
    return 'Nội tổng quát'; // Mặc định nếu không khớp
  }

  // Kiểm tra lịch trống của bác sĩ
  async checkAvailability(doctorId: string, date: string, timeSlot: string): Promise<boolean> {
    const existingAppointment = await this.appointmentsService.findByDoctor(doctorId);
    return !existingAppointment.some(
      (appt) => appt.date.toISOString().split('T')[0] === date && appt.timeSlot === timeSlot,
    );
  }

  // Tìm bác sĩ có lịch trống ngay lập tức (cho khám gấp)
  // async findAvailableDoctorsNow(): Promise<Doctor[]> {
  //   const now = new Date();
  //   const currentDate = now.toISOString().split('T')[0];
  //   const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  //   const timeSlots = [
  //     '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  //     '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  //   ];

  //   const doctors = await this.doctorModel.find({ isActive: true }).exec();
  //   const availableDoctors = [];

  //   for (const doctor of doctors) {
  //     const appointments = await this.appointmentsService.findByDoctor(doctor._id.toString());
  //     const bookedSlots = appointments
  //       .filter((appt) => appt.date.toISOString().split('T')[0] === currentDate)
  //       .map((appt) => appt.timeSlot);

  //     const availableSlots = timeSlots.filter(
  //       (slot) => slot > currentTime && !bookedSlots.includes(slot)
  //     );
  //     if (availableSlots.length > 0) {
  //       availableDoctors.push(doctor);
  //     }
  //   }
  //   return availableDoctors;
  // }

  // Đặt lịch hẹn
  async bookAppointment(
    patientId: string,
    doctorId: string,
    date: string,
    timeSlot: string,
    symptoms: string[],
  ): Promise<{ success: boolean; message?: string }> {
    const createAppointmentDto: CreateAppointmentDto = {
      doctorId,
      date,
      timeSlot,
      symptoms,
      serviceType: 'consultation',
    };

    try {
      const user = { userId: patientId, role: 'patient' };
      await this.appointmentsService.create(createAppointmentDto, user);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message || 'Có lỗi xảy ra khi đặt lịch.' };
    }
  }
}