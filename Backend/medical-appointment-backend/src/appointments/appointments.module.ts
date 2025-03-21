// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema } from './schemas/appointment.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { DoctorSchema } from '../doctors/schemas/doctor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Appointment', schema: AppointmentSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Doctor', schema: DoctorSchema },
    ]),
  ],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule {}