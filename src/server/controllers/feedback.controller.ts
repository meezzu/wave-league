import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { FeedbackRepo } from '../../data/feedback';

export class FeedbackController extends BaseController {
  getMany = async (req: Request, res: Response) => {
    try {
      const feedbacks = await FeedbackRepo.getPaged(req.query);

      this.handleSuccess(req, res, feedbacks);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const feedback = await FeedbackRepo.byID(req.params.id);

      this.handleSuccess(req, res, feedback);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const feedback = await FeedbackRepo.create(req.body);

      this.handleSuccess(req, res, feedback);
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const feedbacks = new FeedbackController();
