import * as dotenv from 'dotenv';
dotenv.config();
import { NextFunction, Request, Response } from 'express';
import { Server } from './lib/Server/index';
import nasaRouter from './nasa/nasaRouter';
import { init as concurencyServiceInit } from './nasa/concurencyService';
import { errorHandlers } from './errorHandler';

const {
  SERVER_PORT,
  SERVER_TIMEOUT
} = process.env;

concurencyServiceInit();

export const application = Server
  .create()
  .enableQueryParser()
  .addRoutes([nasaRouter])
  .registerMiddleware((req: Request, _res: Response, next: NextFunction) => {
    const now = new Date().toISOString();
    const queryParams = { ...req.query };
    console.log(`${now} Registered new request from ip: ${req.ip} with query params: ${queryParams}`);
    next();
  })
  .addRoutes([nasaRouter])
  .registerErrorHandlers(errorHandlers)
  .build();


application.listen(SERVER_PORT, () => {
  console.info(`Server listening on port: ${SERVER_PORT}`);
}).setTimeout(parseInt(SERVER_TIMEOUT || ''));
