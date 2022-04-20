import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { PointRepo } from '../../data/point';
import { WeekRepo } from '../../data/week';
export class ChartsController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const thisWeek = await WeekRepo.getModel()
        .find()
        .sort({ created_at: -1 })
        .limit(1);

      const week_number = req.query.week || thisWeek[0].week_number;

      const query = { week_number };

      const charts = await PointRepo.getPaged({
        query,
        sort: req.query.sort || '-points',
        page: Number(req.query.page),
        per_page: Number(req.query.per_page),
        populations: {
          path: 'artiste',
          select: 'artiste_name avatar record_label'
        }
      });

      this.handleSuccess(req, res, charts);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}
export const charts = new ChartsController();
