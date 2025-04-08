// src/doctors/schemas/doctor.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  specialty: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  experience: number;

  @Prop([String])
  languages: string[];

  @Prop({ type: { name: String, address: String, department: String } })
  hospital: { name: string; address: string; department: string };

  @Prop({ required: true, enum: ['doctor', 'staff'], default: 'doctor' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, default: null })
  avatar?: string;

  @Prop([String])
  subSpecialties: string[];

  @Prop([{ degree: String, institution: String, year: Number, description: String }])
  qualifications: { degree: string; institution: string; year: number; description: string }[];

  @Prop()
  bio: string;

  @Prop([{ day: String, startTime: String, endTime: String, available: Boolean }])
  workingHours: { day: string; startTime: string; endTime: string; available: boolean }[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Appointment' }], default: [] })
  appointments: Types.ObjectId[];

  @Prop({ default: 0 })
  rating: number;

  @Prop([{ patientId: Types.ObjectId, rating: Number, comment: String, date: Date }])
  reviews: { patientId: Types.ObjectId; rating: number; comment: string; date: Date }[];

  @Prop()
  lastLogin: Date;
}

export type DoctorDocument = Doctor & Document & {
  _id: mongoose.Types.ObjectId;
};

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.index({ email: 1 }, { unique: true });
DoctorSchema.index({ specialty: 1 });