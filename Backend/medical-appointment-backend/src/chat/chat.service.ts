import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}

  async createMessage(senderId: string, receiverId: string, content: string) {
    const newMessage = new this.messageModel({
      senderId,
      receiverId,
      content,
    });
    return newMessage.save();
  }

  async getMessages(userId: string, doctorId: string) {
    return this.messageModel
      .find({
        $or: [
          { senderId: userId, receiverId: doctorId },
          { senderId: doctorId, receiverId: userId },
        ],
      })
      .sort({ createdAt: 1 });
  }
}