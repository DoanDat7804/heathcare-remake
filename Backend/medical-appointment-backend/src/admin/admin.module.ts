import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { NewsModule } from '../news/news.module';

@Module({
  imports: [UsersModule, DoctorsModule, NewsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}