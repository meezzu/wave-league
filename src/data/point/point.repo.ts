import { BaseRepository } from '../base';
import { IPoint } from './point.model';
import PointSchema from './point.schema';

class PointRepository extends BaseRepository<IPoint> {
  constructor() {
    super('Point', PointSchema);
  }

  async getPoints(artistes: string[], week: number): Promise<number> {
    const points = await this.get({
      query: {
        artiste: { $in: artistes },
        week_number: week
      }
    });

    return points.reduce(function (acc, cur) {
      return acc + Number(cur?.points);
    }, 0);
  }
  
}

export const PointRepo = new PointRepository();
