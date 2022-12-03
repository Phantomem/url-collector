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

export const application = Server
  .create()
  .enableQueryParser()
  .registerEntryMiddleware((req: Request, _res: Response, next: NextFunction) => {
    const now = new Date().toISOString();
    console.log(`${now} Registered new request from ip: ${req.ip}`);
    next();
  })
  .addRoutes([nasaRouter])
  .registerErrorHandlers(errorHandlers)
  .build();

concurencyServiceInit().then(() => {
  application.listen(SERVER_PORT, () => {
    console.info(`Server listening on port: ${SERVER_PORT}`);
  }).setTimeout(parseInt(SERVER_TIMEOUT || ''));
});
