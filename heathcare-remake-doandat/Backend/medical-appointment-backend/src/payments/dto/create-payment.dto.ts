export class CreatePaymentDto {
    appointmentId: string;
    patientId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: string;
    paymentDate: Date;
  }