import { HTTPUnavailableError } from '../lib/error';
import * as cache from '../lib/cache';
import { differenceInDays } from '../lib/date';
import { ApodParams } from './nasaTypes';

const { SERVER_TIMEOUT } = process.env;

const CONCURENCY_KEY = 'CONCURENCY';

export const get = (): number => cache.get<number>(CONCURENCY_KEY) || 0;
export const set = (newValue: number): void => {
  cache.set(CONCURENCY_KEY, newValue);
}

export const calculateConcurency = (params: ApodParams): number => {
  const daysBetweenPeriod = differenceInDays(params.startDate, params.endDate);
  const serverApiTimeout = parseInt(SERVER_TIMEOUT || '');
  const firstRequestTime = 500;
  const nextRequestTime = 200;

  const approximateRequestTime = firstRequestTime + (daysBetweenPeriod * nextRequestTime);
  
  return Math.ceil(approximateRequestTime / serverApiTimeout);
}

export const lock = async (i: number): Promise<void> => {
  const concurency = get();
  const newConcurency = i + concurency;

  if (newConcurency > parseInt(process.env.CONCURRENT_REQUESTS || '')) {
    throw new HTTPUnavailableError();
  }

  set(newConcurency);
}

export const unlock = async (i: number): Promise<void> => {
  const concurency: number = get();
  set(concurency - i);
}

export async function init() {
  await set(0);
} 
