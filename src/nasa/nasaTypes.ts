export interface ApodParams {
  startDate: string,
  endDate: string,
}

export interface ApodResponseData {
  date: Date;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export interface ApodResponseError {
  code: string;
  msg: string;
  service_version: string;
}
