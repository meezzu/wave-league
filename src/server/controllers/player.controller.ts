import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { PlayerRepo } from '../../data/player';
import gateman from '../../server/gateman';
import { SquadRepo } from '../../data/squad';

export class PlayerController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const players = await PlayerRepo.get({ query: {} });
      this.handleSuccess(req, res, players);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  /**
   * Creates a user account and makes a call to the wallet
   * service to create a wallet for the user.
   */
  signup = async (req: Request, res: Response) => {
    try {
      const player = await PlayerRepo.createAccount(req.body);

      const token = await gateman.createSession({ id: player._id });

      const data = { player, token };

      this.handleSuccess(req, res, data);
    } catch (err) {
      this.handleError(req, res, err);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const player = await PlayerRepo.logIntoAccount(req.body.email);

      const token = await gateman.createSession({ id: player._id });

      const data = { player, token };

      this.handleSuccess(req, res, data);
    } catch (err) {
      this.handleError(req, res, err);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const player = await PlayerRepo.byID(req.params.id);
      this.handleSuccess(req, res, player);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const player = await PlayerRepo.destroy(req.params.id);
      this.handleSuccess(req, res, player);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  update = async (req: Request, res: Response) => {
    const update = { $set: req.body };
    try {
      const player = await PlayerRepo.update(req.params.id, update);
      this.handleSuccess(req, res, player);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getSquad = async (req: Request, res: Response) => {
    try {
      const squad = await SquadRepo.byQuery(
        { player: req.user },
        {
          populations: {
            path: 'artistes',
            select: 'price avatar artiste_name record_label'
          }
        }
      );
      this.handleSuccess(req, res, squad);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const players = new PlayerController();
