import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { ScoreRepo } from '../../data/score';

export class ScoresController extends BaseController {
  getAllScores = async (req: Request, res: Response) => {
    try {
      const scores = await ScoreRepo.getPaged({
        sort: req.query.sort || 'created_at',
        page: Number(req.query.page),
        per_page: Number(req.query.per_page)
      });
      this.handleSuccess(req, res, scores);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getScores = async (req: Request, res: Response) => {
    try {
      const _id = req.params.id;
      const query = { _id };

      const score = await ScoreRepo.getPaged({
        query,
        sort: req.query.sort || 'created_at',
        page: Number(req.query.page),
        per_page: Number(req.query.per_page)
      });
      this.handleSuccess(req, res, score);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getScoresWeek = async (req: Request, res: Response) => {
    try {
      const week_number = req.params.wid;
      const _id = req.params.id;
      const query = { _id, week_number };

      const scoreweek = await ScoreRepo.get({
        query
      });
      this.handleSuccess(req, res, scoreweek);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}
export const scores = new ScoresController();
