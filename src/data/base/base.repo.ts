import mongoose, { Model, Schema, FilterQuery } from 'mongoose';
import { Repository, Query, QueryResult, PaginationQuery } from '.';

export class BaseRepository<T> implements Repository<T> {
  private model: Model<T>;
  constructor(protected name: string, protected schema: Schema<T>) {
    this.model = mongoose.model<T>(name, schema);
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
   * @param _id
   * @param projections
   * @param archived
   */
  byID(_id: string, projections?: any): Promise<T> {
    const query = this.getQuery(_id);
    return this.model.findOne(query).select(projections).exec();
  }

  /**
   * Finds a document by an object query.
   * @param query
   * @param projections
   * @param archived
   */
  async byQuery(query: any, projections?: any): Promise<T> {
    return this.model
      .findOne({ ...query, deleted_at: undefined })
      .select(projections)
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
   * @param query Query
   */
  async getPaged(query: PaginationQuery): Promise<QueryResult<T>> {
    const page = Number(query.page) - 1 || 0;
    const per_page = Number(query.per_page) || 20;
    const offset = page * per_page;
    const sort = query.sort || 'created_at';

    const result = await this.model
      .find({ ...query.conditions, deleted_at: undefined })
      .limit(per_page)
      .select(query.projections)
      .skip(offset)
      .sort(sort)
      .exec();

    return {
      page: page + 1,
      per_page,
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
