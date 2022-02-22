import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { TransferRepo } from '../../data/transfer';

export class TransferController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const transfers = await TransferRepo.list({ conditions: {} });

      this.handleSuccess(req, res, transfers);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const transfer = await TransferRepo.byID(req.params.id);

      this.handleSuccess(req, res, transfer);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  createTransfer = async (req: Request, res: Response) => {
    try {
      const transfer = await TransferRepo.create(req.body);

      this.handleSuccess(req, res, transfer);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const transfers = new TransferController();
