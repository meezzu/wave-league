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
  archived?: boolean | string;
  query?: any;
  page?: number;
  per_page?: number;
  projections?: any;
  sort?: string | object;
}

/**
 * A repository query
 */
export interface Query {
  conditions: any;
  projections?: any;
  sort?: string | object;
}

export interface Repository<T> {
  create(attributes: T): Promise<T>;
  byID(id: string, projections?: any, archived?: boolean): Promise<T>;
  byQuery(query: any, projections?: any, archived?: boolean);
  getPaged(query: PaginationQuery): Promise<QueryResult<T>>;
  get(query: Query): Promise<T[]>;
  update(condition: string | object, update: any): Promise<T>;
  updateAll(condition: string | object, update: any): Promise<T[]>;
  remove(condition: string | object): Promise<T>;
  destroy(condition: string | object): Promise<T>;
}
