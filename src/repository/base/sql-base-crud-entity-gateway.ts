import { Inject } from '@nestjs/common';
import * as MYSQL from 'mysql2/promise';

export interface PaginatedResult<R> {
  result?: R[];
  data?: R[];
  metadata: {
    count: number;
    limit: number;
    total_pages: number;
    page: number;
    has_prev_page: boolean;
    has_next_page: boolean;
    prev_page: number;
    next_page: number;
    size?: number;
  };
}

export default class SqlBaseCrudEntityGateway {
  mysql: MYSQL.Pool;
  constructor(@Inject('MYSQL_CONNECTION') mysql: MYSQL.Pool) {
    this.mysql = mysql;
  }
  async runQuery<P>(query: string, params?: unknown | unknown[]): Promise<P[]> {
    return await this.queryWithLogging<P>(this.mysql, query, params);
  }

  async queryWithLogging<P>(
    source: MYSQL.Pool,
    query: string,
    params?: unknown | unknown[],
  ): Promise<P[]> {
    try {
      const queryPromise = (await source.query(
        query,
        params,
      )) as unknown as P[][];
      return queryPromise[0];
    } catch (err) {
      throw err;
    }
  }
  async paginationSelect<P>(
    {
      query,
      limit,
      page,
      max_group_concat_length = 10000000,
      max_sort_buffer_size,
    }: {
      query: string;
      limit: number;
      page: number;
      max_group_concat_length?: number;
      max_sort_buffer_size?: number;
    },
    params?: any,
  ): Promise<PaginatedResult<P>> {
    page = parseInt(page as unknown as string) || 1;
    limit = parseInt(limit as unknown as string) || 5;
    const result = await this.runQuery<P>(
      `SET group_concat_max_len=${max_group_concat_length};
      ${max_sort_buffer_size ? `SET sort_buffer_size=${max_sort_buffer_size};` : ''}
     SELECT *, Count(*) Over () AS _count FROM ${query}
     LIMIT ${(page - 1) * limit},${limit}
    `,
      params,
    );
    const count: number =
      max_group_concat_length && max_sort_buffer_size
        ? result[2][0]?._count
        : max_group_concat_length || max_sort_buffer_size
          ? result[1][0]?._count
          : (result[0] as any)?._count;
    const total_pages = Math.ceil(count / limit) || 0;
    const has_prev_page = page > 1;
    const has_next_page = page < total_pages;
    const prev_page = has_prev_page ? page - 1 : null;
    const next_page = has_next_page ? page + 1 : null;
    const metadata = {
      count: count || 0,
      limit: parseInt(limit as unknown as string),
      page: parseInt(page as unknown as string),
      total_pages,
      has_next_page,
      has_prev_page,
      next_page,
      prev_page,
    };
    return {
      result:
        max_group_concat_length && max_sort_buffer_size
          ? (result[2] as unknown as P[])
          : max_group_concat_length || max_sort_buffer_size
            ? (result[1] as unknown as P[])
            : result,
      metadata,
    };
  }
}
