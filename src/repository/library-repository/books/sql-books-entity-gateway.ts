import { Inject, Injectable } from '@nestjs/common';
import SqlBaseCrudEntityGateway from '../../base/sql-base-crud-entity-gateway';
import BooksEntityGateway from '../service-gateway/books/books-entity-gateway';
import * as MYSQL from 'mysql2/promise';
import { TableNames } from 'src/constants/enums/table-name';
import { Books } from 'src/constants/dto/books/sql-books';

@Injectable()
export default class SqlBooksEntityGateway
  extends SqlBaseCrudEntityGateway
  implements BooksEntityGateway
{
  mysql: MYSQL.Pool;
  constructor(@Inject('MYSQL_CONNECTION') mysql: MYSQL.Pool) {
    super(mysql);
    this.mysql = mysql;
  }
  async getBookById(id: string): Promise<any> {
    const queryStr = `SELECT * FROM ${TableNames.CUSTOMER} c WHERE c.customer_id=?`;
    const result = this.runQuery(queryStr, [id]);
    return result;
  }
  async createBook(book: Books): Promise<any> {
    const queryStr = `INSERT INTO ${TableNames.CUSTOMER} SET ? ON DUPLICATE KEY UPDATE ?`;
    const result = this.runQuery(queryStr, [book, book]);
    return result;
  }
}
