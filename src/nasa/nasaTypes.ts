import { Request } from 'express';

export interface ApodParams {
  startDate: string,
  endDate: string,
}

export interface ApodRequest extends Request {
  concurency: number;
}
