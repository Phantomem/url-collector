import { Request, Response } from "express";
import { getApodUrls } from "./apodService";
import { ApodParams } from './nasaTypes';


export async function getNasaUrlsHandler(req: Request, res: Response) {
  const { startDate, endDate } = req.query;

  const urls = await getApodUrls({ startDate, endDate } as ApodParams);
  
  res.status(200).json({ urls });
}
