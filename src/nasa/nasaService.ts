import { ApiProvider, BuildUrl, CalculateRequestConcurency, DivideQueryParams, HandleError, HandleResponse, ObjectType } from "../lib/ApiProvider";
import { differenceInDays, divideDateRangeToPeriods } from "../lib/date";
import { HTTPInternalError } from "../lib/error";

const {
  API_APOD_URL,
  API_KEY,
} = process.env;

const URL = `${API_APOD_URL}?api_key=${API_KEY}`;

export interface NasaParams {
  startDate: string,
  endDate: string,
}
export type ApiResponse = string[];

export const calculateRequestConcurency: CalculateRequestConcurency<NasaParams> = (
  params,
) => {
  const daysBetweenPeriod = differenceInDays(params.startDate, params.endDate);
  const serverApiTimeout = Number(process.env.SERVER_API_TIMEOUT);
  const firstRequestTime = 500;
  const nextRequestTime = 200;

  const approximateRequestTime = firstRequestTime + (daysBetweenPeriod * nextRequestTime);

  return Math.ceil(approximateRequestTime / serverApiTimeout);
}

export const handleResponse: HandleResponse<ApiResponse> = (response) => {
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

export const handleError: HandleError = (error) => {
  console.error('Unexpected Error! ', error.message);
  throw new HTTPInternalError();
};

export const buildUrl: BuildUrl<NasaParams> = ({ startDate, endDate }) => {
  return `${URL}&start_date=${startDate}&end_date=${endDate}`;
};

export const divideQueryParams: DivideQueryParams<NasaParams> = ({ startDate, endDate }, concurency) => {
  const periods = divideDateRangeToPeriods(startDate, endDate, concurency);
  return periods.map(period => ({ startDate: period[0], endDate: period[1] }));
};

const apodUrlProvider = new ApiProvider<NasaParams, ApiResponse>(
  Number(process.env.CONCURRENT_REQUESTS),
  handleResponse,
  handleError,
  buildUrl,
  calculateRequestConcurency,
  divideQueryParams,
)

export async function getApodUrls(startDate: string, endDate: string) {
  return await apodUrlProvider.call({ startDate, endDate })
}
