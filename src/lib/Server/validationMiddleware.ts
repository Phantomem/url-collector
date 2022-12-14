/* eslint-disable @typescript-eslint/no-explicit-any */
// FIXME remove any type
import { HTTPValidationError } from "../error";
import Ajv, { ErrorObject, JSONSchemaType } from 'ajv';
import addFormats from "ajv-formats"; 
import { NextFunction, RequestHandler, Request, Response } from "express";

const ajv = new Ajv();
addFormats(ajv);

export type RequestKeyValues = 'query' | 'params';

export const findRequestKeyValues = (keys: string[], scope: RequestKeyValues, req: Request): Record<string, unknown> => {
  return keys.reduce((accumulator, key) => {
    return { ...accumulator, [key]: req[scope][key] };
  }, {});
};

export const getSchemaPropsNames = (schema: JSONSchemaType<any>): string[] => Object.keys(schema.properties);

export const validate = (schema: JSONSchemaType<any>, scope: RequestKeyValues): RequestHandler =>  {
  const validateSchema = ajv.compile(schema);
  return (req: Request, _res: Response, next: NextFunction) => {
    const propNames = getSchemaPropsNames(schema);
    const valid = validateSchema({ ...findRequestKeyValues(propNames, scope, req) });

    if (!valid) {
      throw new HTTPValidationError<ErrorObject[]>(validateSchema.errors as ErrorObject[]);
    }

    next();
  };
}

export function queryValidatorMiddleware(schema: JSONSchemaType<any>) {
  return validate(schema, 'query');
}
