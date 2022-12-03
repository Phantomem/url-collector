import { NextFunction, Response } from "express";
import { getApodUrls } from "./apodService";
import { unlock } from "./concurencyService";
import { ApodParams, ApodRequest } from './nasaTypes';

export async function getNasaUrlsHandler(req: ApodRequest, res: Response, next: NextFunction) {
  const { startDate, endDate } = req.query;
  const { concurency } = req;

  try {
    const urls = await getApodUrls({ startDate, endDate } as ApodParams, concurency);

    res.status(200).json({ urls });
  } catch (error) {

    return next(error);
  } finally {
    unlock(concurency);
  }
}
