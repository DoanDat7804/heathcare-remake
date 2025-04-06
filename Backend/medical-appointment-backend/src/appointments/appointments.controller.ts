// src/appointments/appointments.controller.ts
import { Controller, Post, Get, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() body: any, @Request() req) {
    return this.appointmentsService.create(body, req.user);
  }

  @Get('me')
  getMyAppointments(@Request() req) {
    if (req.user.role === 'patient') {
      return this.appointmentsService.findByPatient(req.user.userId);
    } else if (req.user.role === 'doctor') {
      return this.appointmentsService.findByDoctor(req.user.userId);
    }
  }

  @Put(':id/confirm')
  confirm(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.confirm(id, req.user);
  }
}