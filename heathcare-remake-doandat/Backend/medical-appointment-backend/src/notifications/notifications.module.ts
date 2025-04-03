// src/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './schemas/notification.schema';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
    BullModule.registerQueue({ name: 'notifications' }),
  ],
  providers: [NotificationsService],
})
export class NotificationsModule {}