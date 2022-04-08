import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { LeagueRepo } from '../../data/league';

export class LeagueController extends BaseController {

 getMany = async (req: Request, res: Response) => {
    try {
      const leagues = await LeagueRepo.getPaged({
          sort: req.query.sort || 'created_at',
          page: Number(req.query.page),
          per_page: Number(req.query.per_page)
      });

      this.handleSuccess(req, res, leagues);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
  
}    

export const league = new LeagueController();