import { Inject } from '@nestjs/common';
import { InjectionKey } from 'src/constants/enums/injection-keys/injection-key';
import BooksLendEntityGateway from 'src/repository/library-repository/service-gateway/lend-books/books-entity-gateway';
import * as moment from 'moment';
export class GetBookReturnDetailsByName {
  constructor(
    @Inject(InjectionKey.LENTBOOKS) private lendBooks: BooksLendEntityGateway,
  ) {}
  async consume({ book_name }: { book_name: string }): Promise<any> {
    const returnDatesResult =
      await this.lendBooks.getBookLendInfoByBookName(book_name);
    const returnDate = returnDatesResult?.map((rd) => {
      return {
        lend_date: moment(rd.lend_date).format('YYYY-MM-DD'),
        days_to_return: rd.days_to_return,
        return_date: moment(rd.return_date).format('YYYY-MM-DD'),
        book_name: rd.book_name,
        customer_name: rd.customer_name,
      };
    });
    return returnDate;
  }
}
