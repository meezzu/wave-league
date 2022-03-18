import mongoose, { Model, Schema, FilterQuery } from 'mongoose';
import { Repository, Query, QueryResult, PaginationQuery } from '.';

export class BaseRepository<T> implements Repository<T> {
  protected model: Model<T>;
  constructor(protected name: string, protected schema: Schema<T>) {
    this.model = mongoose.model<T>(name, schema);
  }

  getModel() {
    return this.model;
  }

  /**
   * Converts a passed condition argument to a query
   * @param condition string or object condition
   */
  getQuery = (condition: string | object): FilterQuery<any> => {
    return typeof condition === 'string'
      ? { _id: condition, deleted_at: undefined }
      : { ...condition, deleted_at: undefined };
  };

  /**
   * Creates one or more documets.
   */
  create(attributes: T): Promise<T> {
    return this.model.create(attributes);
  }

  /**
   * Finds a document by it's id
   * @param id
   * @param opts
   */
  byID(id: string, opts?: { projections?: any; populations?: any }): Promise<T> {
    const query = this.getQuery(id);
    return this.model
      .findOne(query)
      .select(opts?.projections)
      .populate(opts?.populations)
      .exec();
  }

  /**
   * Finds a document by an object query.
   * @param query
   * @param opts
   */
  async byQuery(
    query: any,
    opts?: { projections?: any; populations?: any }
  ): Promise<T> {
    return this.model
      .findOne({ ...query, deleted_at: undefined })
      .select(opts?.projections)
      .populate(opts?.populations)
      .exec();
  }

  /**
   * Finds all documents that match a query
   * @param query
   */
  get(query: Query): Promise<T[]> {
    const sort = query.sort || 'created_at';
    return this.model
      .find({ ...query.conditions, deleted_at: undefined })
      .select(query.projections)
      .sort(sort)
      .exec();
  }

  /**
   * Same as `get()` but returns paginated results.
   * @param opts Query
   */
  async getPaged(opts?: PaginationQuery): Promise<QueryResult<T>> {
    const query = opts?.query ?? {};
    const page = Number(opts?.page) - 1 || 0;
    const per_page = Number(opts?.per_page) || 20;
    const offset = page * per_page;
    const sort = opts?.sort || 'created_at';

    const finalQuery = { ...query, deleted_at: undefined };

    const [totalForQuery, total, result] = await Promise.all([
      this.model.countDocuments(finalQuery).exec(),
      this.model.countDocuments().exec(),
      this.model
        .find(finalQuery)
        .limit(per_page)
        .select(opts?.projections)
        .populate(opts.populations)
        .skip(offset)
        .sort(sort)
        .exec()
    ]);

    return {
      total_pages: Math.ceil(totalForQuery / per_page),
      filter_total: totalForQuery,
      page: page + 1,
      per_page,
      total,
      sort,
      result
    };
  }

  /**
   * Allows the user of atomic operators such as $inc in updates.
   * Note: It does not trigger mongoose `save` hooks.
   * @param condition Query condition to match against documents
   * @param update The document update
   */
  update(condition: string | object, update: any): Promise<T> {
    const query = this.getQuery(condition);
    return this.model.findOneAndUpdate(query, update, { new: true }).exec();
  }

  /**
   * Updates multiple documents that match a query
   * @param condition
   * @param update
   */
  async updateAll(condition: string | object, update: any): Promise<T[]> {
    const query = this.getQuery(condition);

    await this.model.updateMany(query, update, {}).exec();
    return this.model.find(query).exec();
  }

  /**
   * Soft deletes a document by created `deleted_at` field in the document and setting it to true.
   * @param condition
   */
  remove(condition: string | object): Promise<T> {
    const query: FilterQuery<any> = this.getQuery(condition);
    const updateQuery: any = { deleted_at: new Date() };
    const opt = { new: true };
    return this.model.findOneAndUpdate(query, updateQuery, opt).exec();
  }

  /**
   * Permanently deletes a document by removing it from the collection
   * @param condition
   */
  destroy(condition: string | object): Promise<T> {
    const query = this.getQuery(condition);
    return this.model.findOneAndDelete(query).exec();
  }
}
