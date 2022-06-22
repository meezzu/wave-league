import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { PointRepo } from '../../data/point';

export class PointsController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const points = await PointRepo.getPaged({
        ...req.query
      });

      this.handleSuccess(req, res, points);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const point = await PointRepo.byID(req.params.id);

      this.handleSuccess(req, res, point);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const point = await PointRepo.create(req.body);

      this.handleSuccess(req, res, point);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const points = new PointsController();
