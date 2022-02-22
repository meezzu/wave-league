import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { SquadRepo } from '../../data/squad';
import { TransferRepo } from '../../data/transfer';

export class SquadController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const squads = await SquadRepo.list({ conditions: {} });

      this.handleSuccess(req, res, squads);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.byID(req.params.id);

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.create(req.body);

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  update = async (req: Request, res: Response) => {
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
      const squad = await SquadRepo.removeArtiste(req.params.id, req.body.aid);

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  addArtiste = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.addArtiste(req.params.id, req.params.aid);

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  transfers = async (req: Request, res: Response) => {
    try {
      const transfers = await TransferRepo.list({
        conditions: { squad: req.params.id }
      });

      this.handleSuccess(req, res, transfers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  weekTransfers = async (req: Request, res: Response) => {
    try {
      const transfers = await TransferRepo.list({
        conditions: { squad: req.params.id, week: req.params.wid }
      });

      this.handleSuccess(req, res, transfers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const squads = new SquadController();
