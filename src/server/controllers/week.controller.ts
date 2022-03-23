import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { WeekRepo } from '../../data/week';

export class WeekController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const weeks = await WeekRepo.getPaged(req.query);

      this.handleSuccess(req, res, weeks);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const week = await WeekRepo.byID(req.params.id);

      this.handleSuccess(req, res, week);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const week = await WeekRepo.create(req.body);

      this.handleSuccess(req, res, week);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const weeks = new WeekController();
