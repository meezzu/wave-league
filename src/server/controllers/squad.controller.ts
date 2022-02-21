import { BaseController } from './base';
import { Request, Response } from 'express';
import { SquadRepo } from 'data/squad';

export class SquadController extends BaseController {
  getSquads = async (req: Request, res: Response) => {
    try {
      const squads = await SquadRepo.list({ conditions: {} });

      this.handleSuccess(req, res, squads);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOneSquad = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.byID(req.params.id);

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  createSquad = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.create(req.body);

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  updateSquad = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.updateWithOperators(req.params.id, {
        $set: req.body
      });

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  removeArtiste = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.removeArtiste(
        req.params.id,
        req.body.artiste_id
      );

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  addArtiste = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.addArtiste(
        req.params.id,
        req.body.artiste_id
      );

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const squads = new SquadController();
