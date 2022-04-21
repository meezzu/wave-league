import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { LeagueRepo } from '../../data/league';
import {
  DuplicateModelError,
  LeagueExistsError
} from '../../common/errors';

export class LeagueController extends BaseController {

  create = async (req: Request, res: Response) => {
    try {
      const exists = await LeagueRepo.byQuery({ league_name: req.body.league_name });
      if (exists) throw new LeagueExistsError();

      const league = await LeagueRepo.create(req.body);

      this.handleSuccess(req, res, league);
    } catch (error) {
      if (error.code === 11000) {
        const err = new DuplicateModelError(error.message);
        return this.handleError(req, res, err);
      }

      this.handleError(req, res, error);
    }
  };

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
  
    getOne = async (req: Request, res: Response) => {
    try {
      const league = await LeagueRepo.getOne(req.params.id);

      this.handleSuccess(req, res, league);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  addSquad = async (req: Request, res: Response) => {
    try {
      const addsquad = await LeagueRepo.addSquad(
        req.params.id,
        req.body.squad
      );

      this.handleSuccess(req, res, addsquad);
    } catch (error) {
      console.log(error, error.code);
      this.handleError(req, res, error);
    }
  };

   removeSquad = async (req: Request, res: Response) => {
    try {
      const removesquad = await LeagueRepo.removeSquad(
        req.params.id,
        req.body.squad
      );

      this.handleSuccess(req, res, removesquad);
    } catch (error) {
      console.log(error, error.code);
      this.handleError(req, res, error);
    }
  };
}    

export const league = new LeagueController();