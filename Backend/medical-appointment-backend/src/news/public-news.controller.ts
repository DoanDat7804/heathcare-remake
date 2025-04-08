import { Controller, Get, Param } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class PublicNewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findAllPublished() {
    return this.newsService.findAllPublished();
  }

  @Get(':id')
  findOnePublished(@Param('id') id: string) {
    return this.newsService.findOnePublished(id);
  }
}