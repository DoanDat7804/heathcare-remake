// src/payments/payments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment } from './schemas/payment.schema';
import Stripe from 'stripe'; // Import đúng cách

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(@InjectModel('Payment') private paymentModel: Model<Payment>) {
    this.stripe = new Stripe('your-stripe-secret-key', {
      apiVersion: '2025-02-24.acacia', // Hoặc phiên bản mới nhất
    });
  }

  async createPayment(appointmentId: string, amount: number, patientId: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Stripe tính bằng cents
      currency: 'vnd',
      payment_method_types: ['card'],
    });

    const payment = new this.paymentModel({
      appointmentId,
      patientId,
      amount,
      transactionId: paymentIntent.id,
      status: 'pending',
    });
    return payment.save();
  }
}