import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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

  @Prop({ required: true, enum: ['doctor', 'staff'], default: 'doctor' }) // Thêm role
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, default: null }) // Thêm trường avatar
  avatar?: string;
}

export type DoctorDocument = Doctor & Document & {
  _id: mongoose.Types.ObjectId;
};

export const DoctorSchema = SchemaFactory.createForClass(Doctor);