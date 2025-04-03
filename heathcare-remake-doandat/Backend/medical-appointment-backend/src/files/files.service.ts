// import { Injectable } from '@nestjs/common';
// import { Multer } from 'multer'; // Import Multer từ 'multer'

// @Injectable()
// export class FilesService {
//   async uploadFile(file: Multer.File) {
//     return {
//       originalName: file.originalname,
//       filename: file.filename,
//       path: file.path,
//     };
//   }
// }
import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  async uploadFile(file: any) { // Dùng any tạm thời
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
    };
  }
}