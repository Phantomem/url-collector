import { differenceInDays, divideDateRangeToPeriods } from "../lib/date";
import { HTTPInternalError } from "../lib/error";
import { lock, unlock } from './concurencyService';
import { request } from '../lib/request';
import { ApodParams } from './nasaTypes';

const {
  API_APOD_URL,
  API_KEY,
  SERVER_TIMEOUT,
} = process.env;

const URL = `${API_APOD_URL}?api_key=${API_KEY}`;

export const calculateRequestConcurency = (params: ApodParams): number => {
  const daysBetweenPeriod = differenceInDays(params.startDate, params.endDate);
  const serverApiTimeout = parseInt(SERVER_TIMEOUT || '');
  const firstRequestTime = 500;
  const nextRequestTime = 200;

  const approximateRequestTime = firstRequestTime + (daysBetweenPeriod * nextRequestTime);
  console.log(approximateRequestTime, serverApiTimeout);
  return Math.ceil(approximateRequestTime / serverApiTimeout);
}

export const handleResponse = (response): string[] | Error => {
  if (!response) {
    console.error('Empty response!');
    throw new HTTPInternalError();
  }
  if (!response.length && response.code) {
    console.error(`Error code ${response.code} with message ${response.msg}`);
    throw new HTTPInternalError();
  }
  if (response.length) {
    return response.map(e => e.hdurl);
  }

  console.error('Unexpected response! ', response);
  throw new HTTPInternalError();
}

export const handleError = (error): Error => {
  console.error('Unexpected Error! ', error.message);
  throw new HTTPInternalError();
};

export const buildUrl = ({ startDate, endDate }: ApodParams): string => {
  return `${URL}&start_date=${startDate}&end_date=${endDate}`;
};

export const divideQueryParams = (
  { startDate, endDate }: ApodParams,
  concurency: number
): ApodParams[] => {
  const periods = divideDateRangeToPeriods(startDate, endDate, concurency);
  return periods.map(period => ({ startDate: period[0], endDate: period[1] }));
};

export const getRequest = async (params: ApodParams): Promise<string[] | Error> => {
  const url = buildUrl(params);
  const response = await request(url);
  return handleResponse(response);
}

export const getRequests = async (params: ApodParams, concurency: number): Promise<string[] | Error> => {
  const requests = divideQueryParams(params, concurency).map((dividedParams) => getRequest(dividedParams));
  const data = await Promise.all(requests);
  return data.reduce<string[]>((acc, v: string[]) => [...acc, ...v], []);
}

export async function getApodUrls(params: ApodParams) {
  const concurency = calculateRequestConcurency(params);
  console.log({concurency})
  let data;

  if (concurency === 1) {
    data = await getRequest(params);
  } else {
    lock(concurency - 1);
    data = await getRequests(params, concurency);
  }

  unlock(concurency);

  return data;
}
