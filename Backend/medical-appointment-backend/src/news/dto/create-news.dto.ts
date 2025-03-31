export class CreateNewsDto {
    title: string;
    slug: string;
    summary: string;
    content: string;
    author: {
      id: string;
      name: string;
    };
    thumbnail: string;
    isPublished: boolean;
    publishDate: Date;
  }