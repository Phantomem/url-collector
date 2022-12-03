import { NextFunction, Request, Response } from "express";
import { getApodUrls } from "./apodService";
import { unlock } from "./concurencyService";
import { ApodParams } from './nasaTypes';

export async function getNasaUrlsHandler(req: Request, res: Response, next: NextFunction) {
  const { startDate, endDate, } = req.query;
  const concurency = parseInt(req.query.concurency as string);

  try {
    const urls = await getApodUrls({ startDate, endDate } as ApodParams, concurency);

    res.status(200).json({ urls });
  } catch (error) {

    return next(error);
  } finally {
    unlock(concurency);
  }
}
