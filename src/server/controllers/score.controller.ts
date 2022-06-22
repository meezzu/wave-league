import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { ScoreRepo } from '../../data/score';

export class ScoresController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const query: { squad?: string } = {};
      if (req.query.squad) {
        query.squad = req.query.squad as string;
      }

      const scores = await ScoreRepo.getPaged({
        query,
        sort: req.query.sort || 'created_at',
        page: Number(req.query.page),
        per_page: Number(req.query.per_page)
      });
      this.handleSuccess(req, res, scores);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}
export const scores = new ScoresController();
