import { BaseController } from './base';
import { Request, Response } from 'express';
import { PlayerRepo } from '../../data/player';
import gateman from '../../server/gateman';

export class PlayerController extends BaseController {
  getPlayers = async (req: Request, res: Response) => {
    try {
      const players = await PlayerRepo.all({ conditions: {} });
      this.handleSuccess(req, res, players);
    } catch (error) {
      this.handleError(req, res, new Error(''));
    }
  };

  /**
   * Creates a user account and makes a call to the wallet
   * service to create a wallet for the user.
   */
  createPlayer = async (req: Request, res: Response) => {
    try {
      const player = await PlayerRepo.createAccount(req.body);

      const token = await gateman.createSession({ id: player._id });

      const data = { player, token };

      this.handleSuccess(req, res, data);
    } catch (err) {
      this.handleError(req, res, err);
    }
  };
}

export const players = new PlayerController();
