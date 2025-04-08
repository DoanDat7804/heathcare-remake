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

    // Validate date và timeSlot
    const appointmentDate = new Date(createAppointmentDto.date);
    if (appointmentDate < new Date()) {
      throw new BadRequestException('Ngày đặt lịch phải trong tương lai');
    }
    if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(createAppointmentDto.timeSlot)) {
      throw new BadRequestException('Khung giờ không hợp lệ (định dạng: HH:MM-HH:MM)');
    }

    // Kiểm tra patient
    const patient = await this.userModel.findById(user.id || user.userId).exec();
    if (!patient || !patient.isActive) {
      throw new BadRequestException('Tài khoản không hợp lệ hoặc đã bị khóa');
    }

    // Kiểm tra doctor
    const doctor = await this.doctorModel.findById(createAppointmentDto.doctorId).exec();
    if (!doctor || !doctor.isActive) {
      throw new BadRequestException('Bác sĩ không tồn tại hoặc không hoạt động');
    }

    // Kiểm tra khung giờ trùng lặp trong transaction
    const session = await this.appointmentModel.startSession();
    try {
      session.startTransaction();
      const existingAppointment = await this.appointmentModel.findOne({
        doctorId: createAppointmentDto.doctorId,
        date: appointmentDate,
        timeSlot: createAppointmentDto.timeSlot,
      }).exec();
      if (existingAppointment) {
        throw new BadRequestException('Khung giờ này đã được đặt');
      }

      // Tạo lịch hẹn
      const appointment = new this.appointmentModel({
        ...createAppointmentDto,
        patientId: patient._id,
        date: appointmentDate,
      });
      const savedAppointment = await appointment.save();

      // Cập nhật reference
      await Promise.all([
        this.userModel.findByIdAndUpdate(patient._id, { $push: { appointments: savedAppointment._id } }),
        this.doctorModel.findByIdAndUpdate(createAppointmentDto.doctorId, { $push: { appointments: savedAppointment._id } }),
      ]);

      await session.commitTransaction();
      return savedAppointment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
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
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name')
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
    const existingAppointment = await this.appointmentModel.findById(id).exec();
    if (!existingAppointment) {
      throw new NotFoundException(`Lịch hẹn với ID ${id} không tồn tại`);
    }
    

    // Nếu cập nhật date, chuyển từ string sang Date
    if (updateAppointmentDto.date) {
      updateAppointmentDto.date = new Date(updateAppointmentDto.date) as any;
    }

    try {
      const updatedAppointment = await this.appointmentModel
        .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
        .exec();
        if (!updatedAppointment) {
          throw new NotFoundException(`Lịch hẹn với ID ${id} không tồn tại sau khi cập nhật`);
        }
      // Nếu doctorId thay đổi, cập nhật reference
      if (updateAppointmentDto.doctorId && updateAppointmentDto.doctorId !== existingAppointment.doctorId.toString()) {
        await this.doctorModel.findByIdAndUpdate(existingAppointment.doctorId, {
          $pull: { appointments: id },
        }).exec();
        await this.doctorModel.findByIdAndUpdate(updateAppointmentDto.doctorId, {
          $push: { appointments: id },
        }).exec();
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
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new NotFoundException(`Lịch hẹn với ID ${id} không tồn tại`);
    }

    // Xóa reference khỏi User và Doctor
    await Promise.all([
      this.userModel.findByIdAndUpdate(appointment.patientId, { $pull: { appointments: appointment._id } }),
      this.doctorModel.findByIdAndUpdate(appointment.doctorId, { $pull: { appointments: appointment._id } }),
    ]);
  }

  // Cập nhật ghi chú (cho doctor)
  async updateNote(id: string, note: string, doctorId: string): Promise<Appointment> {
    const appointment = await this.appointmentModel.findOne({ _id: id, doctorId }).exec();
    if (!appointment) {
      throw new NotFoundException(`Không tìm thấy lịch hẹn với ID ${id} hoặc bạn không có quyền`);
    }
    appointment.note = note;
    return appointment.save();
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
  async getAllDoctors() {
    const doctors = await this.doctorModel.find().select('name _id specialty').exec();
    console.log('Doctors from DB:', doctors); // Debug dữ liệu bác sĩ
    return doctors;
  }

  async getAllUsers() {
    return this.userModel.find({ role: 'patient' }).select('name _id').exec();
  }
  
}