import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class NewsService {
  constructor(@InjectModel('News') private newsModel: Model<News>) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const { title, slug, summary, content, author } = createNewsDto;
    if (!title || !slug || !summary || !content || !author || !author.id || !author.name) {
      throw new BadRequestException(
        'Thiếu các trường bắt buộc: title, slug, summary, content, author.id, author.name',
      );
    }

    const existingNews = await this.newsModel.findOne({ slug }).exec();
    if (existingNews) {
      throw new BadRequestException('Slug đã tồn tại');
    }

    const newsData = {
      ...createNewsDto,
      author: {
        id: author.id,
        name: author.name,
        role: author.role || 'author',
      },
    };

    console.log('Dữ liệu trước khi lưu:', newsData); // Thêm log để kiểm tra

    const newNews = new this.newsModel(newsData);
    return newNews.save();
  }

  async findAll(): Promise<News[]> {
    return this.newsModel.find().exec();
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`Tin tức với ID ${id} không tìm thấy`);
    }
    return news;
  }

  async update(id: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    if (updateNewsDto.slug) {
      const existingNews = await this.newsModel.findOne({ slug: updateNewsDto.slug }).exec();
      if (existingNews && (existingNews._id as mongoose.Types.ObjectId).toString() !== id) {
        throw new BadRequestException('Slug đã tồn tại');
      }
    }

    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateNewsDto, { new: true })
      .exec();
    if (!updatedNews) {
      throw new NotFoundException(`Tin tức với ID ${id} không tìm thấy`);
    }
    return updatedNews;
  }

  async remove(id: string): Promise<void> {
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`Tin tức với ID ${id} không tìm thấy`);
    }
    await this.newsModel.findByIdAndDelete(id).exec();
  }
}