import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { User } from '../users/schemas/user.schema';
import { Doctor } from '../doctors/schemas/doctor.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel('Appointment') private appointmentModel: Model<Appointment>,
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Doctor') private doctorModel: Model<Doctor>,
  ) {}

  async create(appointmentDto: CreateAppointmentDto, user: any) {
    if (user.role !== 'patient') {
      throw new ForbiddenException('Chỉ bệnh nhân mới đặt được lịch hẹn');
    }
    const appointment = new this.appointmentModel({
      ...appointmentDto,
      patientId: user.userId,
    });
    const savedAppointment = await appointment.save();

    await this.userModel.findByIdAndUpdate(user.userId, { $push: { appointments: savedAppointment._id } });
    await this.doctorModel.findByIdAndUpdate(appointmentDto.doctorId, { $push: { appointments: savedAppointment._id } });

    return savedAppointment;
  }

  async createAdmin(createAppointmentDto: CreateAppointmentDto) {
    const appointment = new this.appointmentModel({
      ...createAppointmentDto,
      status: 'pending',
      symptoms: createAppointmentDto.symptoms || [],
    });
    const savedAppointment = await appointment.save();

    await this.userModel.findByIdAndUpdate(createAppointmentDto.patientId, { $push: { appointments: savedAppointment._id } });
    await this.doctorModel.findByIdAndUpdate(createAppointmentDto.doctorId, { $push: { appointments: savedAppointment._id } });

    return savedAppointment;
  }

  async findByPatient(userId: string) {
    return this.appointmentModel.find({ patientId: userId }).populate('doctorId', 'name specialty').exec();
  }

// src/appointments/appointments.service.ts
async findByDoctor(doctorId: string) {
  console.log("Finding appointments for doctorId:", doctorId);
  const appointments = await this.appointmentModel
    .find({ doctorId })
    .populate('patientId', 'name email phone')
    .populate('doctorId', 'name') // Thêm để lấy tên bác sĩ
    .exec();
  console.log("Appointments found:", appointments);
  return appointments;
}

  async confirm(id: string, user: any) {
    if (user.role !== 'doctor') {
      throw new ForbiddenException('Chỉ bác sĩ mới xác nhận được lịch hẹn');
    }
    const updatedAppointment = await this.appointmentModel.findOneAndUpdate(
      { _id: id, doctorId: user.userId },
      { status: 'confirmed', confirmationDate: new Date() },
      { new: true },
    ).exec();

    if (!updatedAppointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${id} hoặc bạn không có quyền xác nhận`);
    }
    return updatedAppointment;
  }

  async findAll() {
    const appointments = await this.appointmentModel
      .find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name specialty')
      .exec();
    console.log('Appointments from DB:', appointments); // Debug dữ liệu trả về
    return appointments;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    console.log('Dữ liệu cập nhật nhận được:', updateAppointmentDto); // Debug dữ liệu nhận vào

    const existingAppointment = await this.appointmentModel.findById(id).exec();
    if (!existingAppointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${id}`);
    }

    // Cập nhật lịch hẹn
    const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      updateAppointmentDto,
      { new: true }
    ).exec();

    // Nếu doctorId thay đổi, cập nhật danh sách lịch hẹn trong doctorModel
    if (updateAppointmentDto.doctorId && updateAppointmentDto.doctorId !== existingAppointment.doctorId.toString()) {
      // Xóa lịch hẹn khỏi bác sĩ cũ
      await this.doctorModel.findByIdAndUpdate(existingAppointment.doctorId, {
        $pull: { appointments: id },
      }).exec();

      // Thêm lịch hẹn vào bác sĩ mới
      await this.doctorModel.findByIdAndUpdate(updateAppointmentDto.doctorId, {
        $push: { appointments: id },
      }).exec();
    }

    return updatedAppointment;
  }

  async remove(id: string) {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${id}`);
    }

    // Xóa lịch hẹn khỏi user và doctor
    await this.userModel.findByIdAndUpdate(appointment.patientId, { $pull: { appointments: id } }).exec();
    await this.doctorModel.findByIdAndUpdate(appointment.doctorId, { $pull: { appointments: id } }).exec();

    return this.appointmentModel.findByIdAndDelete(id).exec();
  }

  async getAllDoctors() {
    const doctors = await this.doctorModel.find().select('name _id specialty').exec();
    console.log('Doctors from DB:', doctors); // Debug dữ liệu bác sĩ
    return doctors;
  }

  async getAllUsers() {
    return this.userModel.find({ role: 'patient' }).select('name _id').exec();
  }

  async updateNote(id: string, note: string, doctorId: string) {
    const appointment = await this.appointmentModel.findOne({ _id: id, doctorId }).exec();
    if (!appointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${id} hoặc bạn không có quyền`);
    }
    appointment.note = note;
    return appointment.save();
  }
}