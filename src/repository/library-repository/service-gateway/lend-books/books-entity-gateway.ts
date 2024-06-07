import { Books } from 'src/constants/dto/books/sql-books';
import { Customer } from 'src/constants/dto/customer/sql-customer';

export default interface BooksLendEntityGateway {
  getBookLendInfoByBookName(bookName: string): Promise<any>;
  getReturnBooksByCustomerID(
    customer_id: string,
    books_ids: string[],
  ): Promise<any>;
  transactionToInsertFileData({
    customer,
    books,
  }: {
    customer: Customer;
    books: {
      book_details: Books;
      lend_books: {
        id: string;
        lend_date: string;
        days_to_return: number;
        return_date: string;
      };
    }[];
  }): Promise<any>;
}
