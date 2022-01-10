import { Request, Response } from 'express';
import bunyan from 'bunyan';

/**
 * Prevents passwords, credit card details etc from being logged.
 * @param body HTTP request body
 */
const removeSensitiveData = ({ password, ...body }) => body;

/**
 * Serializes an Express request for Bunyan logging
 * @param req Express request object
 */
export const reqSerializer = (req: Request) => {
  if (!req || !req.socket) return req;

  return {
    id: req.id,
    url: req.url,
    method: req.method,
    headers: req.headers,
    remotePort: req.socket.remotePort,
    remoteAddress: req.socket.remoteAddress,
    origin_service: req.headers['x-origin-service'],
    ...(req.body || Object.keys(req.body).length !== 0
      ? { body: removeSensitiveData(req.body) }
      : undefined)
  };
};

/**
 * Serializes an Express response for Bunyan logging
 * @param res Express response object
 */
export const resSerializer = (res: Response) => {
  if (!res || !res.statusCode) return res;
  return {
    statusCode: res.statusCode,
    // @ts-ignore
    headers: res.getHeaders(),
    body: res.body
  };
};

/**
 * Extends the standard bunyan error serializer and allows custom fields to be added to the error log
 */
export const errSerializer = (err: any) => {
  const { url, data, req } = err;
  const bunyanSanitizedError = bunyan.stdSerializers.err(err);
  return {
    ...bunyanSanitizedError,
    url,
    data,
    req
  };
};
