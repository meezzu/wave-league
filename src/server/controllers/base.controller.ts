import { Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { ControllerError } from '../../common/errors';
import logger from '../../common/services/logger';
import { MetricsService } from '../services';

export class BaseController {
  /**
   * Handles operation success and sends a HTTP response
   * @param req Express request
   * @param res Express response
   * @param data Success data
   */
  handleSuccess = (
    req: Request,
    res: Response,
    data: any,
    code: number = HttpStatus.OK
  ) => {
    if (res.headersSent) return;

    res.jSend.success(data, code);
    logger.logAPIResponse(req, res);
    MetricsService.record(req, res);
  };

  /**
   * Handles operation error, sends a HTTP response and logs the error.
   * @param req Express request
   * @param res Express response
   * @param error Error object
   * @param message Optional error message. Useful for hiding internal errors from clients.
   */
  handleError = (req: Request, res: Response, err: Error, message?: string) => {
    /**
     * Useful when we call an asynchrous function that might throw
     * after we've sent a response to client
     */
    if (res.headersSent) return logger.error(err);

    /**
     * the error can either be the "error_code" itself or "data" object that contains the error code
     */
    //@ts-ignore
    const { data, error_code, code } = <ControllerError>err;

    const errorMessage = err.message || message;

    res.jSend.error(null, errorMessage, code, data?.error_code || error_code);
    logger.logAPIError(req, res, err);
    MetricsService.record(req, res);
  };
}
