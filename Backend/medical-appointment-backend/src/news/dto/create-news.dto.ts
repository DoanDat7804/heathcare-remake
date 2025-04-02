export class CreateNewsDto {
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: {
    id: string;
    name: string;
    role?: string; // Tùy chọn, sẽ có mặc định trong service
  };
  thumbnail: string;
  isPublished: boolean;
  publishDate: Date;
}