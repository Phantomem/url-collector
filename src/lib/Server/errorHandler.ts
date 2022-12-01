import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HTTPError, HTTPInternalError } from "../error";

export const httpErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (error instanceof HTTPError) {
    res.status(error.code).json(error.toMessage());
  }
  next(new HTTPInternalError());
};

export const unknownErrorHandler = (
  error: HTTPInternalError,
  req: Request,
  res: Response,
): void => {
  console.error('Unknow error occured! ', error.message);
  res.status(error.code).json(error.toMessage());
};

export const errorHandler: ErrorRequestHandler[] = [httpErrorHandler, unknownErrorHandler];
