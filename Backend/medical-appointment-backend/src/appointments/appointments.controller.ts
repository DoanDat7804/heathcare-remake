import { Controller, Post, Get, Put, Param, Body, UseGuards, Request, Delete, ForbiddenException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

// Thay đổi tiền tố controller để phù hợp với /admin/appointments
@Controller() // Loại bỏ 'appointments' ở đây
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post('appointments') // Endpoint cho patient: /appointments
  create(@Body() body: CreateAppointmentDto, @Request() req) {
    return this.appointmentsService.create(body, req.user);
  }

  @Post('admin/appointments') // Endpoint cho admin: /admin/appointments
  createAdminAppointment(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền tạo lịch hẹn này');
    }
    return this.appointmentsService.createAdmin(createAppointmentDto);
  }

  @Get('appointments/me')
  getMyAppointments(@Request() req) {
    console.log("User from token:", req.user);
    if (!req.user || !req.user.role) {
      throw new ForbiddenException("Token không hợp lệ hoặc thiếu vai trò");
    }
    if (req.user.role === 'patient') {
      return this.appointmentsService.findByPatient(req.user.userId);
    } else if (req.user.role === 'doctor') {
      return this.appointmentsService.findByDoctor(req.user.userId);
    } else {
      throw new ForbiddenException(`Vai trò ${req.user.role} không được phép truy cập`);
    }
  }

  @Get('appointments/doctors') // Đổi thành /appointments/doctors
  getAllDoctors() {
    return this.appointmentsService.getAllDoctors();
  }

  @Put('appointments/:id/note')
  updateNote(@Param('id') id: string, @Body('note') note: string, @Request() req) {
  if (req.user.role !== 'doctor') {
    throw new ForbiddenException('Chỉ bác sĩ mới có quyền cập nhật ghi chú');
  }
  return this.appointmentsService.updateNote(id, note, req.user.userId);
}

  @Get('appointments/users') // Đổi thành /appointments/users
  getAllUsers() {
    return this.appointmentsService.getAllUsers();
  }

  @Put('appointments/:id/confirm') // Đổi thành /appointments/:id/confirm
  confirm(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.confirm(id, req.user);
  }

  @Get('admin/appointments') // Endpoint: /admin/appointments
  getAllAppointments(@Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền xem tất cả lịch hẹn');
    }
    return this.appointmentsService.findAll();
  }

  @Put('admin/appointments/:id') // Endpoint: /admin/appointments/:id
  updateAppointment(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto, @Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền cập nhật lịch hẹn');
    }
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete('admin/appointments/:id') // Endpoint: /admin/appointments/:id
  deleteAppointment(@Param('id') id: string, @Request() req) {
    if (req.user.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới có quyền xóa lịch hẹn');
    }
    return this.appointmentsService.remove(id);
  }
}