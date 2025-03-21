// src/appointments/appointments.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { User } from '../users/schemas/user.schema';
import { Doctor } from '../doctors/schemas/doctor.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel('Appointment') private appointmentModel: Model<Appointment>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Doctor') private doctorModel: Model<Doctor>,
  ) {}

  async create(appointmentDto: any, user: any) {
    if (user.role !== 'patient') throw new ForbiddenException('Chỉ bệnh nhân mới đặt được lịch hẹn');
    const appointment = new this.appointmentModel({
      ...appointmentDto,
      patientId: user.userId,
    });
    const savedAppointment = await appointment.save();

    await this.userModel.findByIdAndUpdate(user.userId, { $push: { appointments: savedAppointment._id } });
    await this.doctorModel.findByIdAndUpdate(appointmentDto.doctorId, { $push: { appointments: savedAppointment._id } });

    return savedAppointment;
  }

  async findByPatient(userId: string) {
    return this.appointmentModel.find({ patientId: userId }).populate('doctorId', 'name specialty');
  }

  async findByDoctor(doctorId: string) {
    return this.appointmentModel.find({ doctorId }).populate('patientId', 'name');
  }

  async confirm(id: string, user: any) {
    if (user.role !== 'doctor') throw new ForbiddenException('Chỉ bác sĩ mới xác nhận được lịch hẹn');
    return this.appointmentModel.findOneAndUpdate(
      { _id: id, doctorId: user.userId },
      { status: 'confirmed', confirmationDate: new Date() },
      { new: true },
    );
  }
}