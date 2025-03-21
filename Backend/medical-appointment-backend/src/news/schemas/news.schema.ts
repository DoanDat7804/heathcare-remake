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

  @Prop({
    type: {
      id: String,
      name: String,
      role: String,
    },
    required: true,
  })
  author: {
    id: string;
    name: string;
    role: string;
  };

  @Prop([String])
  categories: string[];

  @Prop([String])
  tags: string[];

  @Prop()
  thumbnail: string;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  publishDate: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);