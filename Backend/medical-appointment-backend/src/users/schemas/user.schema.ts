// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ enum: ['Nam', 'Nữ', 'Khác'] })
  gender: string;

  @Prop({
    type: {
      street: String,
      district: String,
      city: String,
      country: String,
    },
  })
  address: {
    street: string;
    district: string;
    city: string;
    country: string;
  };

  @Prop({
    type: {
      bloodType: String,
      allergies: [String],
      chronicDiseases: [String],
      currentMedications: [String],
    },
  })
  healthInfo: {
    bloodType: string;
    allergies: string[];
    chronicDiseases: string[];
    currentMedications: string[];
  };

  @Prop({ type: [{ type: Types.ObjectId, ref: 'MedicalRecord' }] })
  medicalHistory: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Appointment' }] })
  appointments: Types.ObjectId[];

  @Prop({ default: 'patient' })
  role: string;

  @Prop()
  avatar: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { unique: true });