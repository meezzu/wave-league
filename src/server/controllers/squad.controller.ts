import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { SquadRepo } from '../../data/squad';
import { TransferRepo } from '../../data/transfer';
import {
  DuplicateModelError,
  PlayerSquadExistsError
} from '../../common/errors';

export class SquadController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const squads = await SquadRepo.getPaged({
        ...req.query,
        populations: { path: 'player', select: 'player_name' }
      });

      this.handleSuccess(req, res, squads);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.getOne(req.params.id);

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const exists = await SquadRepo.byQuery({ player: req.user });
      if (exists) throw new PlayerSquadExistsError();

      const squad = await SquadRepo.create(req.body);

      this.handleSuccess(req, res, squad);
    } catch (error) {
      if (error.code === 11000) {
        const err = new DuplicateModelError(error.message);
        return this.handleError(req, res, err);
      }

      this.handleError(req, res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.update(req.params.id, {
        $set: req.body
      });

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  removeArtistes = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.removeArtistes(
        req.params.id,
        req.body.artistes
      );

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  addArtistes = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.addArtistes(
        req.params.id,
        req.body.artistes
      );

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  replaceArtistes = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.replaceArtistes(
        req.params.id,
        req.body.in,
        req.body.out
      );

      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  transfers = async (req: Request, res: Response) => {
    try {
      const transfers = await TransferRepo.getPaged({
        query: { squad: req.params.id }
      });

      this.handleSuccess(req, res, transfers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  weekTransfers = async (req: Request, res: Response) => {
    try {
      const transfers = await TransferRepo.getPaged({
        query: { squad: req.params.id, week: req.params.wid }
      });

      this.handleSuccess(req, res, transfers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const squads = new SquadController();
