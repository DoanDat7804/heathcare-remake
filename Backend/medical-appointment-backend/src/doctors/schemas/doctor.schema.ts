// src/schemas/doctor.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ enum: ['Nam', 'Nữ', 'Khác'] })
  gender: string;

  @Prop()
  specialty: string;

  @Prop([String])
  subSpecialties: string[];

  @Prop([{ degree: String, institution: String, year: Number, description: String }])
  qualifications: { degree: string; institution: string; year: number; description: string }[];

  @Prop()
  experience: number;

  @Prop([String])
  languages: string[];

  @Prop()
  bio: string;

  @Prop({ type: { name: String, address: String, department: String } })
  hospital: { name: string; address: string; department: string };

  @Prop([{ day: String, startTime: String, endTime: String, available: Boolean }])
  workingHours: { day: string; startTime: string; endTime: string; available: boolean }[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Appointment' }] })
  appointments: Types.ObjectId[];

  @Prop({ default: 0 })
  rating: number;

  @Prop([{ patientId: Types.ObjectId, rating: Number, comment: String, date: Date }])
  reviews: { patientId: Types.ObjectId; rating: number; comment: string; date: Date }[];

  @Prop({ default: 'doctor' })
  role: string;

  @Prop()
  avatar: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLogin: Date;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.index({ email: 1 }, { unique: true });
DoctorSchema.index({ specialty: 1 });