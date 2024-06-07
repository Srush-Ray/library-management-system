import { readFileSync } from 'fs';
import RestError from 'src/config/error/rest-error';
import { parse } from 'papaparse';
import { sanitizeArray } from 'src/utils/common-utils';
import { Inject } from '@nestjs/common';
import { InjectionKey } from 'src/constants/enums/injection-keys/injection-key';
import BooksLendEntityGateway from 'src/repository/library-repository/service-gateway/lend-books/books-entity-gateway';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export class ReadFileToDatabase {
  constructor(
    @Inject(InjectionKey.LENTBOOKS) private lendBooks: BooksLendEntityGateway,
  ) {}
  async insertDataIntoDB(dataToInsert) {
    const sanitizedData = sanitizeArray(dataToInsert);
    sanitizedData?.forEach((data) => {
      const booksFinal = data?.book_lend_details?.map((bk, index) => {
        if (bk.book_id && bk.book_name) {
          const dateLend = moment(bk.lend_date, 'YYYY-MM-DD');
          return {
            book_details: {
              book_id: bk.book_id,
              book_name: bk.book_name,
              genre:
                index / 2 == 0
                  ? 'REGULAR'
                  : index / 3 == 0
                    ? 'NOVEL'
                    : 'FICTION',
              author_name: bk.author_name,
              total_copies: 1,
              available_copies: 0,
            },
            lend_books: {
              id: uuidv4(),
              lend_date: bk.lend_date,
              days_to_return: bk.days_to_return,
              return_date: moment(dateLend)
                .add(bk.days_to_return || 7, 'days')
                .format('YYYY-MM-DD'),
            },
          };
        }
      });
      this.lendBooks.transactionToInsertFileData({
        customer: {
          customer_id: data?.customer_id,
          customer_name: data?.customer_name,
        },
        books: booksFinal,
      });
    });
  }
  async readFile(filename: string) {
    try {
      const csvFile = readFileSync(`src/uploads/csv/${filename}`);
      const csvFileData = csvFile.toString();
      const parseCsv = await parse(csvFileData, {
        header: false,
        skipEmptyLines: true,
      });
      const finalData = parseCsv?.data?.map((item) => {
        try {
          return {
            customer_id: item?.[0],
            customer_name: item?.[1],
            book_lend_details: JSON.parse(item?.[2]),
          };
        } catch (error) {}
      });
      const data = this.insertDataIntoDB(finalData);
      return data;
    } catch (error) {
      throw new RestError(error.message, 400);
    }
  }
}
