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
  conditions: any;
  projections?: any;
  sort?: string | object;
}

export interface Repository<T> {
  create(attributes: T): Promise<T>;
  byID(id: string, opts: { projections?: any; populations?: any }): Promise<T>;
  byQuery(
    query: any,
    opts: { projections?: any; populations?: any }
  ): Promise<T>;
  getPaged(query: PaginationQuery): Promise<QueryResult<T>>;
  get(query: Query): Promise<T[]>;
  update(condition: string | object, update: any): Promise<T>;
  updateAll(condition: string | object, update: any): Promise<T[]>;
  remove(condition: string | object): Promise<T>;
  destroy(condition: string | object): Promise<T>;
}
