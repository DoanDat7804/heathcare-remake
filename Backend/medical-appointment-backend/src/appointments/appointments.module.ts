// src/appointments/appointments.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentSchema } from './schemas/appointment.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { DoctorSchema } from '../doctors/schemas/doctor.schema';
import { DialogflowService } from '../dialogflow/dialogflow.service';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Appointment', schema: AppointmentSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Doctor', schema: DoctorSchema },
    ]),
    forwardRef(() => DoctorsModule), // Sử dụng forwardRef để tránh vòng lặp phụ thuộc
  ],
  providers: [AppointmentsService, DialogflowService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}