// src/schemas/appointment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop()
  serviceType: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  timeSlot: string;

  @Prop({ enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'], default: 'pending' })
  status: string;

  @Prop()
  note: string;

  @Prop([String])
  symptoms: string[];

  @Prop({ min: 1, max: 5 })
  priority: number;

  @Prop({ default: false })
  isPrepaid: boolean;

  @Prop()
  confirmationDate: Date;

  @Prop()
  rejectionReason: string;

  @Prop()
  doctorNote: string;

  @Prop({ default: false })
  notificationSent: boolean;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

AppointmentSchema.index({ patientId: 1, date: 1 });
AppointmentSchema.index({ doctorId: 1, date: 1 });
AppointmentSchema.index({ status: 1 });