export class CreateMedicalRecordDto {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    date: Date;
    diagnosis: string[];
    symptoms: string[];
  }