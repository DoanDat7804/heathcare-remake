import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class News extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  summary: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Object, required: true })
  author: { id: string; name: string; role?: string };

  @Prop({ required: false }) // Đảm bảo có trường này
  thumbnail?: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  publishDate?: Date;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const NewsSchema = SchemaFactory.createForClass(News);