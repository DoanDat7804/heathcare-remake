// src/appointments/appointments.service.ts
import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { User } from '../users/schemas/user.schema';
import { Doctor } from '../doctors/schemas/doctor.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel('Appointment') private appointmentModel: Model<Appointment>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Doctor') private doctorModel: Model<Doctor>,
  ) {}

  // Tạo lịch hẹn
  async create(createAppointmentDto: CreateAppointmentDto, user: any): Promise<Appointment> {
    if (user.role !== 'patient') {
      throw new ForbiddenException('Chỉ bệnh nhân mới đặt được lịch hẹn');
    }

    try {
      // Kiểm tra tài khoản patient
      const patient = await this.userModel.findById(user.userId).exec();
      if (!patient || !patient.isActive) {
        throw new BadRequestException('Tài khoản không hợp lệ hoặc đã bị khóa');
      }

      // Kiểm tra bác sĩ có tồn tại không
      const doctorExists = await this.doctorModel.findById(createAppointmentDto.doctorId);
      if (!doctorExists) {
        throw new BadRequestException('Bác sĩ không tồn tại');
      }

      // Kiểm tra lịch hẹn trùng
      const existingAppointment = await this.appointmentModel.findOne({
        doctorId: createAppointmentDto.doctorId,
        date: new Date(createAppointmentDto.date),
        timeSlot: createAppointmentDto.timeSlot,
      });
      if (existingAppointment) {
        throw new BadRequestException('Khung giờ này đã được đặt');
      }

      // Tạo lịch hẹn mới
      const appointment = new this.appointmentModel({
        ...createAppointmentDto,
        patientId: user.userId,
        date: new Date(createAppointmentDto.date), // Chuyển string sang Date
        status: 'pending', // Đặt mặc định status
      });

      const savedAppointment = await appointment.save();

      // Cập nhật reference trong User và Doctor
      await Promise.all([
        this.userModel.findByIdAndUpdate(user.userId, { $push: { appointments: savedAppointment._id } }),
        this.doctorModel.findByIdAndUpdate(createAppointmentDto.doctorId, { $push: { appointments: savedAppointment._id } }),
      ]);

      return savedAppointment;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new BadRequestException(
          Object.values(error.errors).map(err => err.message).join(', ')
        );
      }
      throw error; // Ném lại các lỗi khác để xử lý ở tầng trên
    }
  }

  // Lấy lịch hẹn của patient
  async findByPatient(userId: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ patientId: userId })
      .populate('doctorId', 'name specialty')
      .exec();
  }

  // Lấy lịch hẹn của doctor
  async findByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.appointmentModel
      .find({ doctorId })
      .populate('patientId', 'name')
      .exec();
  }

  // Xác nhận lịch hẹn (cho doctor)
  async confirm(id: string, user: any): Promise<Appointment> {
    if (user.role !== 'doctor') {
      throw new ForbiddenException('Chỉ bác sĩ mới xác nhận được lịch hẹn');
    }

    const appointment = await this.appointmentModel.findOneAndUpdate(
      { _id: id, doctorId: user.userId },
      { status: 'confirmed', confirmationDate: new Date() },
      { new: true }
    ).exec();

    if (!appointment) {
      throw new NotFoundException('Lịch hẹn không tồn tại hoặc không thuộc về bác sĩ này');
    }

    return appointment;
  }

  // Lấy tất cả lịch hẹn (cho admin)
  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel
      .find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name specialty')
      .exec();
  }

  // Cập nhật lịch hẹn (cho admin)
  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    try {
      // Nếu cập nhật date, chuyển từ string sang Date
      if (updateAppointmentDto.date) {
        updateAppointmentDto.date = new Date(updateAppointmentDto.date) as any;
      }

      const updatedAppointment = await this.appointmentModel
        .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
        .exec();

      if (!updatedAppointment) {
        throw new NotFoundException(`Lịch hẹn với ID ${id} không tồn tại`);
      }

      return updatedAppointment;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new BadRequestException(
          Object.values(error.errors).map(err => err.message).join(', ')
        );
      }
      throw error;
    }
  }

  // Xóa lịch hẹn (cho admin)
  async remove(id: string): Promise<void> {
    const appointment = await this.appointmentModel.findByIdAndDelete(id).exec();
    if (!appointment) {
      throw new NotFoundException(`Lịch hẹn với ID ${id} không tồn tại`);
    }

    // Xóa reference khỏi User và Doctor
    await Promise.all([
      this.userModel.findByIdAndUpdate(appointment.patientId, { $pull: { appointments: appointment._id } }),
      this.doctorModel.findByIdAndUpdate(appointment.doctorId, { $pull: { appointments: appointment._id } }),
    ]);
  }
}