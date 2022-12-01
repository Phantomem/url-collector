import { Request, Response } from "express";
import { getApodUrls } from "./nasaService";

export async function getNasaUrlsHandler(req: Request, res: Response) {
  const { startDate, endDate } = req.query;

  const urls = await getApodUrls(startDate as string, endDate as string);
  
  res.status(200).json({ urls });
}
