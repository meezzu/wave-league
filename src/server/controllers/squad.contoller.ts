import { SquadRepo } from '../../data/squad';
import { Request, Response } from 'express';
import { BaseController } from './base';

export class SquadController extends BaseController {
  createSquad = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.createSquad(req.body);
      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
  updateSquadDetails = async (req: Request, res: Response) => {
    try {
      const update = req.body;
      const squad = await SquadRepo.updateWithOperators(req.params.id, update);
      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, new Error(''));
    }
  };
}

export const squads = new SquadController();
