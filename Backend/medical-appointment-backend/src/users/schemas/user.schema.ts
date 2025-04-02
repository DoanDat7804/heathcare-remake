import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ default: 'Giới tính' })
  gender: string;

  @Prop({ default: '' })
  address: string; // Đổi từ object sang string

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 'patient' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);