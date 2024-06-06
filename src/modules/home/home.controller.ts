import {
  Bind,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ReadFileToDatabase } from './services/read-file-init-db';

@Controller('/')
export class HomeController {
  constructor(private readonly readFileService: ReadFileToDatabase) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `src/uploads/csv`,
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadFile(@Body() body: { filename: string }) {
    return await this.readFileService.readFile(body.filename);
  }
}
