import { JSONSchemaType } from "ajv";
import { NextFunction, Request, Response, Router } from "express";
import { queryValidatorMiddleware } from '../lib/Server/validationMiddleware';
import { calculateConcurency, lock } from "./concurencyService";
import { getNasaUrlsHandler } from './nasaHandler';
import { ApodParams } from './nasaTypes';

const router = Router();

const dateTypeSchema = {
  type: 'string',
  format: 'date',
};

const urlRouteSchema = {
  type: 'object',
  properties: {
    startDate: dateTypeSchema,
    endDate: dateTypeSchema,
  },
  required: ['startDate', 'endDate'],
  additionalProperties: false
};

// FIXME remove any
const validationMiddleware = queryValidatorMiddleware(urlRouteSchema as JSONSchemaType<any>);

const concurrencyMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { startDate, endDate } = req.query;
  const concurency = calculateConcurency({ startDate, endDate } as ApodParams);
  lock(concurency)
    .then(() => {
      req.query.concurency = concurency.toString();
      next();
    })
    .catch(e => next(e));
};

router.get('/', validationMiddleware, concurrencyMiddleware, getNasaUrlsHandler);

export default router;
