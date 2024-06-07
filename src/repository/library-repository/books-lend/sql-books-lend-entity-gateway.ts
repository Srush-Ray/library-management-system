import { Inject, Injectable } from '@nestjs/common';
import SqlBaseCrudEntityGateway from '../../base/sql-base-crud-entity-gateway';
import BooksLendEntityGateway from '../service-gateway/lend-books/books-entity-gateway';
import * as MYSQL from 'mysql2/promise';
import { TableNames } from 'src/constants/enums/table-name';
import { Books } from 'src/constants/dto/books/sql-books';
import { Customer } from 'src/constants/dto/customer/sql-customer';
import RestError from 'src/config/error/rest-error';
import { sanitizeArray } from 'src/utils/common-utils';

@Injectable()
export default class SqlBooksLendEntityGateway
  extends SqlBaseCrudEntityGateway
  implements BooksLendEntityGateway
{
  mysql: MYSQL.Pool;
  constructor(@Inject('MYSQL_CONNECTION') mysql: MYSQL.Pool) {
    super(mysql);
    this.mysql = mysql;
  }
  async getBookLendInfoByBookName(bookName: string): Promise<any> {
    try {
      const query = `SELECT * FROM ${TableNames.BOOKS_LEND} bl 
    INNER JOIN ${TableNames.BOOKS} b ON bl.book_id=b.book_id
    INNER JOIN ${TableNames.CUSTOMER} c ON c.customer_id=bl.customer_id
    WHERE b.book_name = ?`;
      const result = await this.runQuery(query, [bookName]);
      return result;
    } catch (error) {
      throw new RestError('Sql Error', 400);
    }
  }
  // async getBookById(id: string): Promise<any> {
  //   const queryStr = `SELECT * FROM ${TableNames.CUSTOMER} c WHERE c.customer_id=?`;
  //   const result = this.runQuery(queryStr, [id]);
  //   return result;
  // }

  async transactionToInsertFileData({
    customer,
    books = [],
  }: {
    customer: Customer;
    books?: {
      book_details: Books;
      lend_books: {
        id: string;
        lend_date: string;
        days_to_return: number;
        return_date: string;
      };
    }[];
  }): Promise<any> {
    const bookDetail = [];
    const lendDetail = [];

    books.forEach((element) => {
      bookDetail?.push(
        `('${element.book_details.book_id}','${element.book_details.book_name}','${element.book_details.author_name}','${element.book_details.genre}',${element.book_details.total_copies},${element.book_details.available_copies})`,
      );
      lendDetail?.push(
        `('${element.lend_books.id}','${element.book_details.book_id}','${customer.customer_id}','${element.lend_books.lend_date}',${element.lend_books.days_to_return},'${element.lend_books.return_date}')`,
      );
    });
    try {
      const transStr = `
      DELIMITER $$
      BEGIN
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
          BEGIN
            ROLLBACK;
          END;  
        
        START TRANSACTION;

        INSERT INTO ${TableNames.CUSTOMER} (customer_id,customer_name)
        VALUES ('${customer.customer_id}','${customer.customer_name}')
        ON DUPLICATE KEY UPDATE
        customer_id = VALUES(customer_id), 
        customer_name = VALUES(customer_name);

        INSERT INTO books (book_id, book_name, author_name, genre, total_copies, available_copies)
        VALUES ${bookDetail?.join(',')};

        INSERT INTO books_lent (id,book_id, customer_id, lend_date, days_to_return, return_date)
        VALUES ${lendDetail?.join(',')}; 

        COMMIT;
      END;
      DELIMITER ;
    `;
      const result = await this.runQuery(transStr);
      return result;
    } catch (error) {
      throw new RestError('Sql Error', 400);
    }
  }

  async getReturnBooksByCustomerID(
    customer_id: string,
    books_ids: string[],
  ): Promise<any> {
    try {
      console.log('books_ids', books_ids);
      const query = `SELECT * FROM ${TableNames.BOOKS_LEND} bl 
    INNER JOIN ${TableNames.BOOKS} b ON bl.book_id=b.book_id
    INNER JOIN ${TableNames.CUSTOMER} c ON c.customer_id=bl.customer_id
    WHERE bl.customer_id = ? AND bl.book_id IN ('${sanitizeArray(books_ids)?.join(`','`)}')`;
      const result = await this.runQuery(query, [customer_id]);
      return result;
    } catch (error) {
      console.log(error);
      throw new RestError('Sql Error', 400);
    }
  }
}
