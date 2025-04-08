// src/dialogflow/dialogflow.controller.ts
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DialogflowService } from './dialogflow.service';

interface DialogflowResponse {
  fulfillmentText: string;
  outputContexts?: { name: string; lifespanCount: number; parameters?: Record<string, any> }[];
}

@Controller('dialogflow-webhook')
export class DialogflowController {
  constructor(private readonly dialogflowService: DialogflowService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async handleWebhook(@Body() body: any, @Request() req: any): Promise<DialogflowResponse> {
    if (!body || !body.queryResult) {
      return { fulfillmentText: 'Dữ liệu không hợp lệ từ webhook. Vui lòng kiểm tra lại.' };
    }

    const intentName = body.queryResult.intent?.displayName || 'Default Fallback Intent';
    const parameters = body.queryResult.parameters || {};
    const contexts = body.queryResult.outputContexts || [];
    const session = body.session || `session-${Date.now()}`;
    const queryText = body.queryResult.queryText || '';

    let responseText = '';
    let outputContexts: { name: string; lifespanCount: number; parameters?: any }[] = [];

    const patientId = req.user?.id || req.user?.sub || req.user?.userId; // Linh hoạt lấy patientId từ JWT
    if (!patientId) {
      responseText = 'Vui lòng đăng nhập để tiếp tục.';
      return { fulfillmentText: responseText };
    }

    switch (intentName) {
      case 'AskCondition': {
        const symptomsList = parameters.symptoms || [];
        const specialty = await this.dialogflowService.getSpecialtyBySymptoms(symptomsList);
        const doctors = await this.dialogflowService.findDoctorsBySpecialty(specialty);
        if (doctors.length === 0) {
          responseText = `Hiện tại không có bác sĩ chuyên khoa ${specialty}. Bạn có muốn thử chuyên khoa khác không?`;
        } else {
          const doctorNames = doctors.map((d) => d.name).join(', ');
          responseText = `Với triệu chứng "${symptomsList.join(', ')}", bạn nên gặp bác sĩ chuyên khoa ${specialty}. Các bác sĩ hiện có: ${doctorNames}. Bạn muốn đặt lịch với ai?`;
          outputContexts = [
            {
              name: `${session}/contexts/awaiting_doctor_selection`,
              lifespanCount: 5,
              parameters: { specialty, symptoms: symptomsList, patientId },
            },
          ];
        }
        break;
      }

      case 'AskConditionAndDoctor': {
        const symptomsList = parameters.symptoms || [];
        const doctorNameFromIntent = parameters.doctor_name;
        const doctor = await this.dialogflowService.findDoctorByName(doctorNameFromIntent);
        if (!doctor) {
          responseText = `Không tìm thấy bác sĩ ${doctorNameFromIntent}. Vui lòng thử lại.`;
        } else {
          const doctorId = doctor._id.toString();
          responseText = `Bạn bị ${symptomsList.join(', ')} và muốn gặp ${doctorNameFromIntent}? Vui lòng cho tôi biết ngày bạn muốn gặp (định dạng: YYYY-MM-DD).`;
          outputContexts = [
            {
              name: `${session}/contexts/awaiting_date`,
              lifespanCount: 5,
              parameters: { doctorId, doctorName: doctorNameFromIntent, symptoms: symptomsList, patientId },
            },
          ];
        }
        break;
      }

      case 'BookSpecificDoctor': {
        const doctorName = parameters.doctor_name;
        const doctorForBooking = await this.dialogflowService.findDoctorByName(doctorName);
        if (!doctorForBooking) {
          responseText = `Không tìm thấy bác sĩ ${doctorName}. Vui lòng thử lại.`;
        } else {
          const doctorId = doctorForBooking._id.toString();
          responseText = `Vui lòng cho tôi biết ngày bạn muốn gặp ${doctorName} (định dạng: YYYY-MM-DD).`;
          outputContexts = [
            {
              name: `${session}/contexts/awaiting_date`,
              lifespanCount: 5,
              parameters: { doctorId, doctorName, patientId },
            },
          ];
        }
        break;
      }

      case 'ProvideDate': {
        const date = parameters.date?.split('T')[0]; // Lấy YYYY-MM-DD
        const dateContext = contexts.find((c) => c.name.endsWith('awaiting_date'));
        if (!dateContext || !date) {
          responseText = 'Vui lòng cung cấp ngày hợp lệ (định dạng: YYYY-MM-DD).';
          break;
        }
        const doctorId = dateContext.parameters.doctorId;
        const doctorNameFromDate = dateContext.parameters.doctorName;
        responseText = `Vui lòng cho tôi biết giờ bạn muốn gặp ${doctorNameFromDate} vào ngày ${date} (ví dụ: 08:00).`;
        outputContexts = [
          {
            name: `${session}/contexts/awaiting_time`,
            lifespanCount: 5,
            parameters: { doctorId, doctorName: doctorNameFromDate, date, patientId },
          },
        ];
        break;
      }

      case 'ProvideTime': {
        const timeSlot = parameters.time; // Giả định Dialogflow gửi HH:MM
        const timeContext = contexts.find((c) => c.name.endsWith('awaiting_time'));
        if (!timeContext || !timeSlot) {
          responseText = 'Vui lòng cung cấp giờ hợp lệ (ví dụ: 08:00).';
          break;
        }
        const doctorIdFromTime = timeContext.parameters.doctorId;
        const doctorNameFromTime = timeContext.parameters.doctorName;
        const bookingDate = timeContext.parameters.date;
        const symptomsFromContext = timeContext.parameters.symptoms || [];

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
              parameters: { doctorId: doctorIdFromTime, doctorName: doctorNameFromTime, date: bookingDate, patientId },
            },
          ];
        } else {
          const result = await this.dialogflowService.bookAppointment(
            patientId,
            doctorIdFromTime,
            bookingDate,
            timeSlot,
            symptomsFromContext,
          );
          responseText = result.success
            ? `Lịch hẹn với ${doctorNameFromTime} vào ${bookingDate} lúc ${timeSlot} đã được đặt thành công!`
            : result.message || `Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.`;
        }
        break;
      }

      case 'Default Fallback Intent': {
        const { symptoms: symptomsList, doctorName } = await this.dialogflowService.classifyInput(queryText);
        if (symptomsList.length > 0 && doctorName) {
          const doctor = await this.dialogflowService.findDoctorByName(doctorName);
          if (doctor) {
            const doctorId = doctor._id.toString();
            responseText = `Bạn bị ${symptomsList.join(', ')} và muốn gặp ${doctorName}? Vui lòng cho tôi biết ngày bạn muốn gặp (định dạng: YYYY-MM-DD).`;
            outputContexts = [
              {
                name: `${session}/contexts/awaiting_date`,
              lifespanCount: 5,
              parameters: { doctorId, doctorName, symptoms: symptomsList, patientId },
              },
            ];
          } else {
            responseText = `Không tìm thấy bác sĩ ${doctorName}. Bạn bị ${symptomsList.join(', ')}, tôi có thể tìm bác sĩ phù hợp cho bạn.`;
          }
        } else if (symptomsList.length > 0) {
          const specialty = await this.dialogflowService.getSpecialtyBySymptoms(symptomsList);
          const doctors = await this.dialogflowService.findDoctorsBySpecialty(specialty);
          const doctorNames = doctors.map((d) => d.name).join(', ');
          responseText = `Với triệu chứng "${symptomsList.join(', ')}", bạn nên gặp bác sĩ chuyên khoa ${specialty}. Các bác sĩ hiện có: ${doctorNames}. Bạn muốn đặt lịch với ai?`;
          outputContexts = [
            {
              name: `${session}/contexts/awaiting_doctor_selection`,
              lifespanCount: 5,
              parameters: { specialty, symptoms: symptomsList, patientId },
            },
          ];
        } else if (doctorName) {
          const doctor = await this.dialogflowService.findDoctorByName(doctorName);
          if (doctor) {
            const doctorId = doctor._id.toString();
            responseText = `Bạn muốn đặt lịch với ${doctorName}? Vui lòng cho tôi biết ngày (định dạng: YYYY-MM-DD).`;
            outputContexts = [
              {
                name: `${session}/contexts/awaiting_date`,
                lifespanCount: 5,
                parameters: { doctorId, doctorName, patientId },
              },
            ];
          } else {
            responseText = `Không tìm thấy bác sĩ ${doctorName}. Vui lòng thử lại.`;
          }
        } else {
          responseText = 'Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể nói rõ hơn không?';
        }
        break;
      }

      default:
        responseText = 'Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể nói lại không?';
    }

    return {
      fulfillmentText: responseText,
      outputContexts,
    };
  }
}