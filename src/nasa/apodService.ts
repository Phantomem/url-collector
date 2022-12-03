import { divideDateRangeToPeriods } from "../lib/date";
import { HTTPInternalError } from "../lib/error";
import { request } from '../lib/request';
import { ApodParams, ApodResponseData, ApodResponseError } from './nasaTypes';

const API_APOD_URL = 'https://api.nasa.gov/planetary/apod';
const {
  API_KEY,
} = process.env;

const URL = `${API_APOD_URL}?api_key=${API_KEY}`;

export const handleResponse = (
  response: ApodResponseData[] | ApodResponseError
): string[] => {
  if (!response) {
    console.error('ApodService Empty response!');
    throw new HTTPInternalError();
  }
  if (!Array.isArray(response)) {
    console.error(`ApodService Error code ${response.code} with message ${response.msg}`);
    throw new HTTPInternalError();
  } else {
    return response.map(e => e.hdurl || e.url);
  }
}

export const handleError = (error: Error): Error => {
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

export const getRequest = async (params: ApodParams): Promise<string[]> => {
  const url = buildUrl(params);
  const response = await request<ApodResponseData[] | ApodResponseError>(url);
  return handleResponse(response);
}

export const getRequests = async (params: ApodParams, concurency: number): Promise<string[]> => {
  const requests = divideQueryParams(params, concurency).map((dividedParams) => getRequest(dividedParams));
  const data = await Promise.all(requests);
  return data.reduce<string[]>((acc, v: string[]) => [...acc, ...v], []);
}

export async function getApodUrls(params: ApodParams, concurency: number): Promise<string[]> {
  return concurency === 1
    ? getRequest(params)
    : getRequests(params, concurency);
}
