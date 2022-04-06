import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { PointRepo } from '../../data/point';
import { WeekRepo } from '../../data/week';
export class ChartsController extends BaseController { 
  getMany = async (req: Request, res: Response) => {
    try {
      const thisWeek = await WeekRepo.getModel().find().sort({ created_at: -1 }).limit(1)

      const weeks = req.query.week
        ? { week_number: req.query.week }
        : {week_number: thisWeek[0].week_number};
      
      console.log(req.query.week)
      const query = {
         ...weeks
      };

      const artistes = await PointRepo.getPaged({
          query,
          sort: req.query.sort|| '-points',
          page: Number(req.query.page),
          per_page: Number(req.query.per_page),
          populations: {path: "artiste", select:"artiste_name avatar record_label"}
      })
      
      this.handleSuccess(req, res, artistes);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };   
}
export const charts = new ChartsController();