export class CreateAppointmentDto {
    patientId: string;
    doctorId: string;
    serviceType: string;
    date: Date;
    timeSlot: string;
  }