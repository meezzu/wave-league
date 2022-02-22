import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { ArtisteRepo } from 'data/artiste';

export class ArtisteController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const artistes = ArtisteRepo.list({
        conditions: {}
      });

      this.handleSuccess(req, res, artistes);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const artiste = ArtisteRepo.byID(req.params.id);

      this.handleSuccess(req, res, artiste);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getPoints = async (req: Request, res: Response) => {
    try {
      const artiste = ArtisteRepo.byID(req.params.id);

      this.handleSuccess(req, res, artiste);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const artistes = new ArtisteController();
