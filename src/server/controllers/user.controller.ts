import { LoginAuthenticationError } from '../../common/errors';
import { userRepo } from '../../data/user';
import { UserDocument } from '../../data/user/user.schema';
import gateman from '../../server/gateman';
import { publisher } from '@random-guys/eventbus';
import { Request, Response } from 'express';
import { BaseController } from './base';

export class UserController extends BaseController {
  socket: string;

  getUser = async (req: Request, res: Response) => {
    try {
      const user = await userRepo.byID(req.user, '+transaction_pin');
      this.handleSuccess(req, res, user);
    } catch (err) {
      this.handleError(req, res, err);
    }
  };

  /**
   * Creates a user account and makes a call to the wallet
   * service to create a wallet for the user.
   */
  signup = async (req: Request, res: Response) => {
    try {
      const user = await userRepo.createAccount(req.body);

      const token = await gateman.createSession({ id: user._id });

      const data = { user, token };

      this.handleSuccess(req, res, data);
    } catch (err) {
      this.handleError(req, res, err);
    }
  };

  /**
   * Logs the user in using their phone number and password
   */
  login = async (req: Request, res: Response) => {
    try {
      const user: UserDocument = await userRepo.byQuery(
        { phone_number: req.body.phone_number },
        '+password +transaction_pin'
      );

      const isPasswordValid = await userRepo.isPasswordValid(
        req.user,
        req.body.password
      );
      if (!isPasswordValid) throw new LoginAuthenticationError();

      const token = await gateman.createSession({ id: user._id });
      this.handleSuccess(req, res, { user, token });
    } catch (err) {
      this.handleError(req, res, err);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const status = await publisher.emit('events', 'user.updated', {
        id: req.user
      });
      this.handleSuccess(req, res, status);
    } catch (err) {
      this.handleError(req, res, err);
    }
  };
}

export default new UserController();
