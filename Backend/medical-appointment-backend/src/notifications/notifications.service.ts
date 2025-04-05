// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notification') private notificationModel: Model<Notification>,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async create(receiverId: string, receiverRole: string, title: string, message: string, type: string, relatedId: string) {
    const notification = new this.notificationModel({
      receiverId,
      receiverRole,
      title,
      message,
      type,
      relatedId,
      isRead: false,
      isEmailSent: false,
    });
    await notification.save();

    // Gửi thông báo qua queue
    await this.notificationsQueue.add({ notificationId: notification._id });
  }
}