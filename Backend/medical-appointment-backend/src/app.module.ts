// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { PaymentsModule } from './payments/payments.module';
import { NewsModule } from './news/news.module';
import { ServicesModule } from './services/services.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/medical-appointment'),
    AuthModule,
    UsersModule,
    DoctorsModule,
    AppointmentsModule,
    MedicalRecordsModule,
    PaymentsModule,
    NewsModule,
    ServicesModule,
    NotificationsModule,
    FilesModule,
  ],
})
export class AppModule {}