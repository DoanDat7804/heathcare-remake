// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { NewsModule } from '../news/news.module';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [AdminModule, UsersModule, DoctorsModule, NewsModule, AppointmentsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}