// src/appointments/appointments.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller() // Không đặt tiền tố chung, mỗi endpoint sẽ tự định nghĩa đường dẫn
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  // Endpoint cho patient: Tạo lịch hẹn mới
  // POST /appointments
  @Post('appointments')
  create(@Body() body: CreateAppointmentDto, @Request() req) {
    return this.appointmentsService.create(body, req.user);
  }

  // Endpoint cho admin: Tạo lịch hẹn mới với quyền admin
  // POST /admin/appointments
  @Post('admin/appointments')
  createAdminAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền tạo lịch hẹn này');
    }
    return this.appointmentsService.createAdmin(createAppointmentDto);
  }

  // Lấy lịch hẹn của người dùng dựa trên vai trò
  // GET /appointments/me
  @Get('appointments/me')
  getMyAppointments(@Request() req) {
    if (!req.user || !req.user.role) {
      throw new ForbiddenException('Token không hợp lệ hoặc thiếu vai trò');
    }
    if (req.user.role === 'patient') {
      return this.appointmentsService.findByPatient(req.user.userId);
    } else if (req.user.role === 'doctor') {
      return this.appointmentsService.findByDoctor(req.user.userId);
    } else {
      throw new ForbiddenException(`Vai trò ${req.user.role} không được phép truy cập`);
    }
  }

  // Lấy danh sách tất cả các bác sĩ
  // GET /appointments/doctors
  @Get('appointments/doctors')
  getAllDoctors() {
    return this.appointmentsService.getAllDoctors();
  }

  // Lấy danh sách tất cả người dùng
  // GET /appointments/users
  @Get('appointments/users')
  getAllUsers() {
    return this.appointmentsService.getAllUsers();
  }

  // Cập nhật ghi chú cho lịch hẹn (chỉ cho bác sĩ)
  // PUT /appointments/:id/note
  @Put('appointments/:id/note')
  updateNote(
    @Param('id') id: string,
    @Body('note') note: string,
    @Request() req,
  ) {
    if (req.user.role !== 'doctor') {
      throw new ForbiddenException('Chỉ bác sĩ mới có quyền cập nhật ghi chú');
    }
    return this.appointmentsService.updateNote(id, note, req.user.userId);
  }

  // Xác nhận lịch hẹn (có thể dành cho tất cả các vai trò theo yêu cầu)
  // PUT /appointments/:id/confirm
  @Put('appointments/:id/confirm')
  confirm(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.confirm(id, req.user);
  }

  // Endpoint cho admin: Lấy danh sách tất cả các lịch hẹn
  // GET /admin/appointments
  @Get('admin/appointments')
  getAllAppointments(@Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền xem tất cả lịch hẹn');
    }
    return this.appointmentsService.findAll();
  }

  // Endpoint cho admin: Cập nhật lịch hẹn
  // PUT /admin/appointments/:id
  @Put('admin/appointments/:id')
  updateAppointment(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req,
  ) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền cập nhật lịch hẹn');
    }
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  // Endpoint cho admin: Xóa lịch hẹn
  // DELETE /admin/appointments/:id
  @Delete('admin/appointments/:id')
  deleteAppointment(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền xóa lịch hẹn');
    }
    return this.appointmentsService.remove(id);
  }
}
