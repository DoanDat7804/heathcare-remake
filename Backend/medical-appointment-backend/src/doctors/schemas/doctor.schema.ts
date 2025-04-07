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

  @Prop({ type: String, default: null }) 
  avatar?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }], default: [] })
  appointments: mongoose.Types.ObjectId[];
}

export type DoctorDocument = Doctor & Document & {
  _id: mongoose.Types.ObjectId;
};

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

// export class BusyTime {
//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true })
//   doctorId: mongoose.Types.ObjectId;

//   @Prop({ required: true })
//   startTime: Date;

//   @Prop({ required: true })
//   endTime: Date;
// }

// export type BusyTimeDocument = BusyTime & Document;

// export const BusyTimeSchema = SchemaFactory.createForClass(BusyTime);