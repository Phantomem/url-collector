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
    start_date: dateTypeSchema,
    end_date: dateTypeSchema,
  },
  required: ['start_date', 'end_date'],
  additionalProperties: false
};

// FIXME remove any
const validationMiddleware = queryValidatorMiddleware(urlRouteSchema as JSONSchemaType<any>);

const concurrencyMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { start_date, end_date } = req.query;
  const concurency = calculateConcurency({ startDate: start_date, endDate: end_date } as ApodParams);
  lock(concurency)
    .then(() => {
      req.query.concurency = concurency.toString();
      // FIXME concider proper mapping between sneakcase to cammelcase
      req.query.startDate = start_date;
      req.query.endDate = end_date;
      next();
    })
    .catch(e => next(e));
};

router.get('/', validationMiddleware, concurrencyMiddleware, getNasaUrlsHandler);

export default router;
