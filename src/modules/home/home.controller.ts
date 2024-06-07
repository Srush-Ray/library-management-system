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
import { GetBookReturnFees } from './services/get-books-fees';

@Controller('/')
export class HomeController {
  constructor(
    private readonly readFileService: ReadFileToDatabase,
    private readonly bookReturnService: GetBookReturnDetailsByName,
    private readonly returnFeesService: GetBookReturnFees,
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

  @Post('return-fees')
  async getBookFees(
    @Body()
    body?: {
      book_ids: string[];
      customer_id: string;
      return_on?: string;
    },
  ) {
    return await this.returnFeesService.consume({
      book_ids: body.book_ids,
      customer_id: body.customer_id,
      return_on: body.return_on,
    });
  }

  @Post('v2/return-fees')
  async getGenreBookFees(
    @Body()
    body?: {
      book_ids: string[];
      customer_id: string;
      return_on?: string;
    },
  ) {
    return await this.returnFeesService.consumeGenreFees({
      book_ids: body.book_ids,
      customer_id: body.customer_id,
      return_on: body.return_on,
    });
  }

  @Post('v3/return-fees')
  async getGenreBookFeesV3(
    @Body()
    body?: {
      book_ids: string[];
      customer_id: string;
      return_on?: string;
    },
  ) {
    return await this.returnFeesService.consumeGenreFeesV3({
      book_ids: body.book_ids,
      customer_id: body.customer_id,
      return_on: body.return_on,
    });
  }
}
