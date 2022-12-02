import { HTTPUnavailableError } from '../lib/error';
import * as cache from '../lib/cache';

const CONCURENCY_KEY = 'CONCURENCY';

export const get = (): number => cache.get<number>(CONCURENCY_KEY) || 0;
export const set = (newValue: number): void => {
  cache.set(CONCURENCY_KEY, newValue);
}

export const lock = (i: number): void => {
  const concurency = get();
  const newConcurency = i + concurency;

  if (newConcurency > parseInt(process.env.CONCURRENT_REQUESTS || '')) {
    throw new HTTPUnavailableError();
  }

  cache.set(CONCURENCY_KEY, newConcurency);
}

export const unlock = (i: number): void => {
  const concurency: number = get();
  set(concurency - i);
}

export function init() {
  set(0);
} 
