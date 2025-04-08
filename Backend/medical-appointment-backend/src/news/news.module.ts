import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { PublicNewsController } from './public-news.controller';
import { NewsSchema } from './schemas/news.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'News', schema: NewsSchema }])],
  controllers: [NewsController, PublicNewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}