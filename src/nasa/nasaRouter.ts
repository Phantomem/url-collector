import { JSONSchemaType } from "ajv";
import { Router } from "express";
import { queryValidatorMiddleware } from '../lib/Server/validationMiddleware';
import { getNasaUrlsHandler } from './handler';

const router = Router();

const dateTypeSchema = {
  'type': 'string',
  'format': 'date',
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

router.get('/', validationMiddleware, getNasaUrlsHandler);

export default router;
