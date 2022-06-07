import { ClientSession } from 'mongoose';

export interface QueryResult<T> {
  page: number;
  per_page: number;
  total: number;
  filter_total: number;
  total_pages: number;
  sort: string | object;
  result: T[];
}

/**
 * A repository query that specifies pagination options
 */
export interface PaginationQuery {
  query?: any;
  page?: number;
  per_page?: number;
  projections?: any;
  populations?: any;
  sort?: string | object;
}

/**
 * A repository query
 */
export interface Query {
  query: any;
  projections?: any;
  populations?: any;
  session?: ClientSession;
  sort?: string | object;
}

export interface SelectOptions {
  projections?: any;
  populations?: any;
}

export interface Repository<T> {
  create(attributes: T): Promise<T>;
  createMany(attributes: T[], session: ClientSession): Promise<T[]>;
  byID(id: string, opts: SelectOptions): Promise<T>;
  byQuery(query: any, opts: SelectOptions): Promise<T>;
  getPaged(query: PaginationQuery): Promise<QueryResult<T>>;
  get(query: Query): Promise<T[]>;
  update(condition: string | object, update: any): Promise<T>;
  updateAll(condition: string | object, update: any): Promise<T[]>;
  remove(condition: string | object): Promise<T>;
  destroy(condition: string | object): Promise<T>;
}
