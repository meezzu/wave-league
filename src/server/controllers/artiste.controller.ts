import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { ArtisteRepo } from '../../data/artiste';
import { PointRepo } from '../../data/point';

export class ArtisteController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const artistes = await ArtisteRepo.getPaged({
        conditions: {}
      });

      this.handleSuccess(req, res, artistes);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const artiste = await ArtisteRepo.byID(req.params.id);

      this.handleSuccess(req, res, artiste);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getPoints = async (req: Request, res: Response) => {
    try {
      const points = await PointRepo.byQuery({
        artiste: req.params.id,
        week_number: req.params.wid
      });

      this.handleSuccess(req, res, points);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const artiste = await ArtisteRepo.create(req.body);

      this.handleSuccess(req, res, artiste);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const artistes = new ArtisteController();
