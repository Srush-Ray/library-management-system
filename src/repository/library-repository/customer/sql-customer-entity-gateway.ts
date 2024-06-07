import { Inject, Injectable } from '@nestjs/common';
import SqlBaseCrudEntityGateway from '../../base/sql-base-crud-entity-gateway';
import CustomerEntityGateway from '../service-gateway/customer/customer-entity-gateway';
// import { GetCustomerById } from 'src/constants/dto/customer/sql-get-customer-by-id';
import * as MYSQL from 'mysql2/promise';
import { Customer } from 'src/constants/dto/customer/sql-customer';
import { TableNames } from 'src/constants/enums/table-name';

@Injectable()
export default class SqlCustomerEntityGateway
  extends SqlBaseCrudEntityGateway
  implements CustomerEntityGateway
{
  mysql: MYSQL.Pool;
  constructor(@Inject('MYSQL_CONNECTION') mysql: MYSQL.Pool) {
    super(mysql);
    this.mysql = mysql;
  }
  async getCustomerById(id: string): Promise<any> {
    const queryStr = `SELECT * FROM ${TableNames.CUSTOMER} c WHERE c.customer_id=?`;
    const result = await this.runQuery(queryStr, [id]);
    return result;
  }
  async createCustomer(customer: Customer): Promise<any> {
    const queryStr = `INSERT INTO ${TableNames.CUSTOMER} SET ? ON DUPLICATE KEY UPDATE ?`;
    const result = await this.runQuery(queryStr, [customer, customer]);
    return result;
  }
}
