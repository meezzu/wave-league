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

  getOne = async (req: Request, res: Response) => {
    try {
      const league = await LeagueRepo.getOne(req.params.id);
      this.handleSuccess(req, res, league);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const league = await LeagueRepo.create(req.body);
      this.handleSuccess(req, res, league);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  addSquad = async (req: Request, res: Response) => {
    try {
      const league = await LeagueRepo.addSquad(
        req.params.id,
        req.body.squad_id
      );
      this.handleSuccess(req, res, league);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  removeSquad = async (req: Request, res: Response) => {
    try {
      const league = await LeagueRepo.removeSquad(
        req.params.id,
        req.body.squad_id
      );

      this.handleSuccess(req, res, league);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getRanking = async (req: Request, res: Response) => {
    try {
      const ranking = await LeagueRepo.getRanking(
        req.params.id,
        Number(req.query.week)
      );

      this.handleSuccess(req, res, ranking);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const leagues = new LeagueController();
