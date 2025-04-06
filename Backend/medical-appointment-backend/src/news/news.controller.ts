import { Controller, Get, Post, Patch, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('admin/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'news');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)/)) {
        return cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif)'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  create(
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const createNewsDto: CreateNewsDto = {
      title: body.title,
      slug: body.slug,
      summary: body.summary,
      content: body.content,
      author: typeof body.author === 'string' ? JSON.parse(body.author) : body.author,
      isPublished: body.isPublished === 'true' || body.isPublished === true,
      publishDate: body.publishDate,
    };
  
    if (file) {
      createNewsDto.thumbnail = `/uploads/news/${file.filename}`;
    }
  
    return this.newsService.create(createNewsDto);
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', '..', 'uploads', 'news');
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image\/(jpg|jpeg|png|gif)/)) {
        return cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif)'), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateNewsDto: UpdateNewsDto = {
      title: body.title,
      slug: body.slug,
      summary: body.summary,
      content: body.content,
      isPublished: body.isPublished === 'true' || body.isPublished === true,
      publishDate: body.publishDate,
      author: typeof body.author === 'string' ? JSON.parse(body.author) : body.author,
    };

    if (file) {
      updateNewsDto.thumbnail = `/uploads/news/${file.filename}`;
    }

    return this.newsService.update(id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}