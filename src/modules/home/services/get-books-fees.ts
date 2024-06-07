import { Inject } from '@nestjs/common';
import { InjectionKey } from 'src/constants/enums/injection-keys/injection-key';
import BooksLendEntityGateway from 'src/repository/library-repository/service-gateway/lend-books/books-entity-gateway';
import * as moment from 'moment';
import RestError from 'src/config/error/rest-error';
import { FEES } from 'src/constants/common-constants';
export class GetBookReturnFees {
  constructor(
    @Inject(InjectionKey.LENTBOOKS) private lendBooks: BooksLendEntityGateway,
  ) {}
  async consume({
    book_ids,
    customer_id,
  }: {
    book_ids: string[];
    customer_id: string;
  }): Promise<any> {
    try {
      const returnDatesResult = await this.lendBooks.getReturnBooksByCustomerID(
        customer_id,
        book_ids,
      );
      if (returnDatesResult?.length) {
        const returnDate = returnDatesResult?.map((rd) => {
          const todayDate = moment(new Date()).format('YYYY-MM-DD');
          const dayDiff = moment().diff(
            moment(rd.lend_date).add(rd.days_to_return, 'days'),
            'days',
          );
          console.log('here dayDiff', dayDiff, todayDate);
          return {
            lend_date: moment(rd.lend_date).format('YYYY-MM-DD'),
            days_to_return: rd.days_to_return,
            actual_return_date: moment(rd.return_date).format('YYYY-MM-DD'),
            book_name: rd.book_name,
            customer_name: rd.customer_name,
            fees: `₹${dayDiff * FEES}`,
            returned_on: todayDate,
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
}
