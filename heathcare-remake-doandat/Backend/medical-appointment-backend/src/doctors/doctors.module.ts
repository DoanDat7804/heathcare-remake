// src/doctors/doctors.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DoctorSchema } from './schemas/doctor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Doctor', schema: DoctorSchema }]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService], // Export service nếu cần sử dụng ở module khác
})
export class DoctorsModule {}