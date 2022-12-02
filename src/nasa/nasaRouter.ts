import { JSONSchemaType } from "ajv";
import { NextFunction, Router } from "express";
import { queryValidatorMiddleware } from '../lib/Server/validationMiddleware';
import { lock } from "./concurencyService";
import { getNasaUrlsHandler } from './nasaHandler';

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

const concurrencyMiddleware = (req, res, next: NextFunction): void => {
  lock(1);
  next();
};

router.get('/', validationMiddleware, concurrencyMiddleware, getNasaUrlsHandler);

export default router;
