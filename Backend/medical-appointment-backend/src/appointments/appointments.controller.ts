// src/appointments/appointments.controller.ts
import { Controller, Post, Get, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post()
  async create(@Body() body: any, @Request() req) {
    console.log('req.user:', req.user);
    return await this.appointmentsService.create(body, req.user);
  }

  @Get('me')
  async getMyAppointments(@Request() req) {
    if (req.user.role === 'patient') {
      const result =  await this.appointmentsService.findByPatient(req.user.id);
      console.log(result, req.user)
      return result
    } else if (req.user.role === 'doctor') {
      return await this.appointmentsService.findByDoctor(req.user.userId);
    }
  }

  @Put(':id/confirm')
  confirm(@Param('id') id: string, @Request() req) {
    return this.appointmentsService.confirm(id, req.user);
  }
}