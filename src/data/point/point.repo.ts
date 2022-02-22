import { BaseRepository } from '../base';
import { IPoint } from './point.model';
import PointSchema from './point.schema';

class PointRepository extends BaseRepository<IPoint> {
  constructor() {
    super('Point', PointSchema);
  }
}

export const PointRepo = new PointRepository();
