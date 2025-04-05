// import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { FilesService } from './files.service';
// import { Multer } from 'multer'; // Import Multer từ 'multer'

// @Controller('files')
// export class FilesController {
//   constructor(private readonly filesService: FilesService) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(@UploadedFile() file: Multer.File) {
//     return this.filesService.uploadFile(file);
//   }
// }
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) { // Dùng any tạm thời
    return this.filesService.uploadFile(file);
  }
}