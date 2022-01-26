import { BaseController } from './base';
import { Request, Response } from 'express';
import { ArtisteRepo } from '../../data/artiste';


export class ArtisteController extends BaseController {
  createArtiste = async (req: Request, res: Response) => {
    try {
      const artiste = await ArtisteRepo.createArtiste(req.body);
      this.handleSuccess(req, res, artiste);
    } catch (error) {
        this.handleError(req, res, error); 
    }
  };

  updateArtiste = async (req: Request, res: Response) => {
      const update = req.body
      try {
        const artiste = await ArtisteRepo.updateWithOperators(req.params.id, update);
        this.handleSuccess(req, res, artiste);
      } catch (error) {
        this.handleError(req, res, error);
      }
  }
}

export const artistes = new ArtisteController();