import { Inject } from '@nestjs/common';
import { InjectionKey } from 'src/constants/enums/injection-keys/injection-key';
import BooksLendEntityGateway from 'src/repository/library-repository/service-gateway/lend-books/books-entity-gateway';
import * as moment from 'moment';
import RestError from 'src/config/error/rest-error';
import { FEES } from 'src/constants/common-constants';
import BooksEntityGateway from 'src/repository/library-repository/service-gateway/books/books-entity-gateway';
export class GetBookReturnFees {
  constructor(
    @Inject(InjectionKey.LENTBOOKS) private lendBooks: BooksLendEntityGateway,
    @Inject(InjectionKey.BOOKLIST) private books: BooksEntityGateway,
  ) {}
  async consume({
    book_ids,
    customer_id,
    return_on = '',
  }: {
    book_ids: string[];
    customer_id: string;
    return_on?: string;
  }): Promise<any> {
    try {
      const returnDatesResult = await this.lendBooks.getReturnBooksByCustomerID(
        customer_id,
        book_ids,
      );
      if (returnDatesResult?.length) {
        const returnDate = returnDatesResult?.map((rd) => {
          const todayDate = return_on
            ? moment(return_on).format('YYYY-MM-DD')
            : moment(new Date()).format('YYYY-MM-DD');
          const dayDiff = moment(todayDate).diff(moment(rd.lend_date), 'days');
          return {
            lend_date: moment(rd.lend_date).format('YYYY-MM-DD'),
            days_to_return: rd.days_to_return,
            return_date: moment(rd.return_date).format('YYYY-MM-DD'),
            returned_on: todayDate,
            days_diff: dayDiff,
            book_name: rd.book_name,
            customer_name: rd.customer_name,
            fees: `₹${dayDiff * FEES}`,
          };
        });
        return returnDate;
      } else {
        return 'No Data Found';
      }
    } catch (error) {
      throw new RestError(error.message, 400);
    }
  }
  async consumeGenreFees({
    book_ids,
    customer_id,
    return_on = '',
  }: {
    book_ids: string[];
    return_on?: string;
    customer_id: string;
  }): Promise<any> {
    try {
      const returnDatesResult = await this.lendBooks.getReturnBooksByCustomerID(
        customer_id,
        book_ids,
      );

      if (returnDatesResult?.length) {
        const returnDate = await Promise.all(
          returnDatesResult?.map(async (rd) => {
            const todayDate = return_on
              ? moment(return_on).format('YYYY-MM-DD')
              : moment(new Date()).format('YYYY-MM-DD');
            const dayDiff = moment(todayDate).diff(
              moment(rd.lend_date),
              'days',
            );
            const genreDetails = await this.books.getGenreFees(rd.genre);
            return {
              lend_date: moment(rd.lend_date).format('YYYY-MM-DD'),
              days_to_return: rd.days_to_return,
              return_date: moment(rd.return_date).format('YYYY-MM-DD'),
              returned_on: todayDate,
              days_diff: dayDiff,
              book_name: rd.book_name,
              customer_name: rd.customer_name,
              fees: `₹${dayDiff * parseFloat(genreDetails?.fees)}`,
            };
          }),
        );

        return returnDate?.map((item) => {
          return {
            ...item,
          };
        });
      } else {
        return 'No Data Found';
      }
    } catch (error) {
      throw new RestError(error.message, 400);
    }
  }
  async consumeGenreFeesV3({
    book_ids,
    customer_id,
    return_on = '',
  }: {
    book_ids: string[];
    return_on?: string;
    customer_id: string;
  }): Promise<any> {
    try {
      const returnDatesResult = await this.lendBooks.getReturnBooksByCustomerID(
        customer_id,
        book_ids,
      );

      if (returnDatesResult?.length) {
        const returnDate = await Promise.all(
          returnDatesResult?.map(async (rd) => {
            const todayDate = return_on
              ? moment(return_on).format('YYYY-MM-DD')
              : moment(new Date()).format('YYYY-MM-DD');
            const dayDiff = moment(todayDate).diff(
              moment(rd.lend_date),
              'days',
            );
            const genreDetails = await this.books.getGenreFees(rd.genre);
            return {
              lend_date: moment(rd.lend_date).format('YYYY-MM-DD'),
              days_to_return: rd.days_to_return,
              return_date: moment(rd.return_date).format('YYYY-MM-DD'),
              returned_on: todayDate,
              days_diff: dayDiff,
              book_name: rd.book_name,
              customer_name: rd.customer_name,
              fees:
                dayDiff <= genreDetails?.mini_days
                  ? `₹${dayDiff * parseFloat(genreDetails?.minimum_fees)}`
                  : `₹${dayDiff * parseFloat(genreDetails?.fees)}`,
            };
          }),
        );

        return returnDate?.map((item) => {
          return {
            ...item,
          };
        });
      } else {
        return 'No Data Found';
      }
    } catch (error) {
      throw new RestError(error.message, 400);
    }
  }
}
