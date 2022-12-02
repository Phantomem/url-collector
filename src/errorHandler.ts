import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HTTPError } from "./lib/error";

export const httpErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (error instanceof HTTPError) {
    res.status(error.code).json(error.toMessage()).send();
  } else {
    next(error);
  }
};

export const unknownErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _: NextFunction,
): void => {
  console.error('Unknow error occured! ', error.message);
  res.status(500).json({ error: 'Internal Error' }).send();
};

export const errorHandlers: ErrorRequestHandler[] = [httpErrorHandler, unknownErrorHandler];
