// src/dialogflow/dialogflow.controller.ts
import { Types } from 'mongoose';
import { Controller, Post, Body } from '@nestjs/common';
import { DialogflowService } from './dialogflow.service';

interface DialogflowResponse {
  fulfillmentText: string;
  outputContexts?: {
    name: string;
    lifespanCount: number;
    parameters?: Record<string, any>;
  }[];
}

@Controller('dialogflow-webhook')
export class DialogflowController {
  constructor(private readonly dialogflowService: DialogflowService) {}

  @Post()
  async handleWebhook(@Body() body: any): Promise<DialogflowResponse> {
    const intentName = body.queryResult.intent.displayName;
    const parameters = body.queryResult.parameters || {};
    const contexts = body.queryResult.outputContexts || [];
    const session = body.session;

    let responseText = '';
    let outputContexts: { name: string; lifespanCount: number; parameters?: any }[] = [];

    switch (intentName) {
      case 'AskCondition':
        const symptoms = parameters.symptoms || [];
        const specialty = await this.dialogflowService.getSpecialtyBySymptoms(symptoms);
        const doctors = await this.dialogflowService.findDoctorsBySpecialty(specialty);
        if (doctors.length === 0) {
          responseText = `Hiện tại không có bác sĩ chuyên khoa ${specialty}. Bạn có muốn thử chuyên khoa khác không?`;
        } else {
          const doctorNames = doctors.map((d) => d.name).join(', ');
          responseText = `Với triệu chứng "${symptoms.join(', ')}", bạn nên gặp bác sĩ chuyên khoa ${specialty}. Các bác sĩ hiện có: ${doctorNames}. Bạn muốn đặt lịch với ai?`;
          outputContexts = [
            {
              name: `${session}/contexts/awaiting_doctor_selection`,
              lifespanCount: 5,
              parameters: { specialty, symptoms },
            },
          ];
        }
        break;

        case 'BookSpecificDoctor':
          const doctorName = parameters.doctor_name;
          const doctor = await this.dialogflowService.findDoctorByName(doctorName);
          if (!doctor) {
            responseText = `Không tìm thấy bác sĩ ${doctorName}. Vui lòng thử lại.`;
          } else {
            const doctorId = (doctor._id as Types.ObjectId).toString();
            responseText = `Vui lòng cho tôi biết ngày bạn muốn gặp ${doctorName}.`;
            outputContexts = [
              {
                name: `${session}/contexts/awaiting_date`,
                lifespanCount: 5,
                parameters: { doctorId, doctorName },
              },
            ];
          }
          break;

      case 'ProvideDate':
        const date = parameters.date.split('T')[0]; // Lấy phần ngày (YYYY-MM-DD)
        const dateContext = contexts.find((c) => c.name.endsWith('awaiting_date'));
        const doctorId = dateContext.parameters.doctorId;
        const doctorNameFromDate = dateContext.parameters.doctorName;
        responseText = `Vui lòng cho tôi biết giờ bạn muốn gặp ${doctorNameFromDate} vào ngày ${date}.`;
        outputContexts = [
          {
            name: `${session}/contexts/awaiting_time`,
            lifespanCount: 5,
            parameters: { doctorId, doctorName: doctorNameFromDate, date },
          },
        ];
        break;

      case 'ProvideTime':
        const timeSlot = parameters.time; // Giả định timeSlot là chuỗi như "08:00"
        const timeContext = contexts.find((c) => c.name.endsWith('awaiting_time'));
        const doctorIdFromTime = timeContext.parameters.doctorId;
        const doctorNameFromTime = timeContext.parameters.doctorName;
        const bookingDate = timeContext.parameters.date;
        const symptomsFromContext = contexts.find((c) =>
          c.name.endsWith('awaiting_doctor_selection'),
        )?.parameters.symptoms || [];

        const isAvailable = await this.dialogflowService.checkAvailability(
          doctorIdFromTime,
          bookingDate,
          timeSlot,
        );
        if (!isAvailable) {
          responseText = `Rất tiếc, ${doctorNameFromTime} không trống vào ${timeSlot} ngày ${bookingDate}. Bạn muốn chọn giờ khác không?`;
          outputContexts = [
            {
              name: `${session}/contexts/awaiting_time`,
              lifespanCount: 5,
              parameters: { doctorId: doctorIdFromTime, doctorName: doctorNameFromTime, date: bookingDate },
            },
          ];
        } else {
          // Giả định patientId cố định (cần thay bằng logic thực tế)
          const patientId = 'some-patient-id';
          const bookingSuccess = await this.dialogflowService.bookAppointment(
            patientId,
            doctorIdFromTime,
            bookingDate,
            timeSlot,
            symptomsFromContext,
          );
          responseText = bookingSuccess
            ? `Lịch hẹn với ${doctorNameFromTime} vào ${bookingDate} lúc ${timeSlot} đã được đặt thành công!`
            : `Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.`;
        }
        break;

      default:
        responseText = 'Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể nói lại không?';
    }

    return {
      fulfillmentText: responseText,
      outputContexts,
    };
  }
}