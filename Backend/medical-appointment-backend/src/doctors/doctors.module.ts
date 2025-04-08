// src/doctors/doctors.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorSchema } from './schemas/doctor.schema';
import { DialogflowService } from '../dialogflow/dialogflow.service';
import { DialogflowController } from '../dialogflow/dialogflow.controller';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Doctor', schema: DoctorSchema }]),
    forwardRef(() => AppointmentsModule), // Sử dụng forwardRef
  ],
  controllers: [DoctorsController, DialogflowController],
  providers: [DoctorsService, DialogflowService],
  exports: [DoctorsService],
})
export class DoctorsModule {}