import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel('News') private newsModel: Model<News>) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const newNews = new this.newsModel(createNewsDto);
    return newNews.save();
  }

  async findAll(): Promise<News[]> {
    return this.newsModel.find().exec();
  }

  async findOne(id: string): Promise<News | null> {
    return this.newsModel.findById(id).exec();
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News | null> {
    return this.newsModel.findByIdAndUpdate(id, updateNewsDto, { new: true }).exec();
  }

  async remove(id: string): Promise<News | null> {
    return this.newsModel.findByIdAndDelete(id).exec();
  }
}