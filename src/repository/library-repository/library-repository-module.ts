import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as MYSQL from 'mysql2/promise';

import SqlCustomerEntityGateway from './customer/sql-customer-entity-gateway';
import { InjectionKey } from 'src/constants/enums/injection-keys/injection-key';
import SqlBooksEntityGateway from './books/sql-books-entity-gateway';
import SqlBooksLendEntityGateway from './books-lend/sql-books-lend-entity-gateway';
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'MYSQL_CONNECTION',
      useFactory: async (configSerivce: ConfigService) => {
        console.log('connecting to MYSQL Server');
        return MYSQL.createPool({
          host: 'localhost',
          port: 3306,
          user: 'root',
          password: '',
          database: 'library',
          ...(configSerivce.get<string>('NODE_ENV') !== 'local'
            ? { ssl: { rejectUnauthorized: false } }
            : {}),
          connectTimeout: 10 * 60 * 1000,
          multipleStatements: true,
        });
      },
      inject: [ConfigService],
    },
    { provide: InjectionKey.CUSTOMER, useClass: SqlCustomerEntityGateway },
    { provide: InjectionKey.BOOKLIST, useClass: SqlBooksEntityGateway },
    { provide: InjectionKey.LENTBOOKS, useClass: SqlBooksLendEntityGateway },
  ],
  exports: [
    InjectionKey.CUSTOMER,
    InjectionKey.LENTBOOKS,
    InjectionKey.BOOKLIST,
  ],
})
export class LibraryRepositoryModule {}
