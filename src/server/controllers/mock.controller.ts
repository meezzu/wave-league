import { BaseController } from './base.controller';
import { Request, Response } from 'express';
import { runWeeklyJob } from '../../workers/handlers';

export class MocksController extends BaseController {
  runWeeklyJob = async (req: Request, res: Response) => {
    try {
      this.handleSuccess(req, res, await runWeeklyJob(Number(req.query.week)));
    } catch (error) {
      this.handleError(req, res, error);
    }
  };
}

export const mocks = new MocksController();
