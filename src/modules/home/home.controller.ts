import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ReadFileToDatabase } from './services/read-file-init-db';
import { GetBookReturnDetailsByName } from './services/get-book-return-details';

@Controller('/')
export class HomeController {
  constructor(
    private readonly readFileService: ReadFileToDatabase,
    private readonly bookReturnService: GetBookReturnDetailsByName,
  ) {}
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

  @Get('book-return-details')
  async getBookReturnDetails(@Query() query?: { book_name: string }) {
    return await this.bookReturnService.consume({
      book_name: query.book_name,
    });
  }
}
