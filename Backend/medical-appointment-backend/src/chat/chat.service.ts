import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import {OpenAI} from 'openai'
import {prompt, tools} from './chat.config'
import { DoctorsService } from '../doctors/doctors.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { CreateAppointmentDto } from 'src/appointments/dto/create-appointment.dto';
import { AuthService } from '../auth/auth.service';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class ChatService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>,
              private readonly doctorService: DoctorsService,
              private readonly appointmentService: AppointmentsService,) {}

  async createMessage(data: any) {
    const msg = data
    let final_prompt = prompt.content
    let userId = ""
    let usersymptoms = ""

    if(msg['token'])
      try {
        const decoded = jwt.verify(msg['token'], process.env.JWT_SECRET|| ""); // Hoặc khóa bí mật bạn đang dùng
        userId = decoded['sub']
      } catch (err) {
        console.error('Token không hợp lệ:', err.message);
    }
    else{
      throw new UnauthorizedException("Yêu cầu token");
    }

    if(msg['docList'])
      final_prompt += `. Danh sách bác sĩ: ${JSON.stringify(msg.docList)}`
    if(msg['symptoms'])
      final_prompt += `. Triệu chứng của bệnh nhân hiện tại: ${JSON.stringify(msg.symptoms)}`
    const response = await new OpenAI().responses.create({
        model: "gpt-4o",
        input: [
          {
            role: 'system',
            content: final_prompt
          },

          { role: "user",
            content: msg['user_msg']
          }
        ],
        tools,
    });
    const toolCall = response.output[0];
    if(toolCall && toolCall['arguments']){
      const args = JSON.parse(toolCall['arguments']);
      if(args['specialty']){
        const docList = await this.doctorService.findBySpecialty(args['specialty'])
        console.log(docList)
        return docList
      }
      else if(args['doctorId']){
        const user = {
          id: userId,
          role: 'patient'
        }
        const args = JSON.parse(toolCall['arguments']);
        const dto: CreateAppointmentDto = {
          doctorId: args['doctorId'],
          serviceType: args['serviceType'],
          date: args['date'],
          timeSlot: args['timeSlot'],
          symptoms: ['Tired']
        };
        return await this.appointmentService.create(dto, user)
        
      }
    }
    return response.output_text
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