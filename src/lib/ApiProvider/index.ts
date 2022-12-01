import { HTTPError, HTTPInternalError } from "../error";
import { getRequest, GetRequest, RequestResponse } from "./getRequest";

export type ObjectType = Record<string, string>;
export type Response = unknown | Error;
export type HandleResponseInput = JSON | Error;
export type HandleResponse<T> = (response: any) => T | Error;
export type HandleError = (error: Error) => HTTPError;
export type BuildUrl<P> = (params: P, daysBetweenPeriod: number) => string;
export type CalculateRequestConcurency<P> = (params: P) => number;
export type DivideQueryParams<P> = (params: P, concurency: number) => P[];

export class ApiProvider<P, T> {
  private MAX_CONCURENT_REQUESTS;
  private handleResponse;
  private buildUrl;
  private handleError;
  private calculateRequestConcurency;
  private divideQueryParams;
  private request = getRequest;
  constructor(
    maxConcurrentRequests: number,
    handleResponse: HandleResponse<T>,
    handleError: HandleError,
    buildUrl: BuildUrl<P>,
    calculateRequestConcurency: CalculateRequestConcurency<P>,
    divideQueryParams: DivideQueryParams<P>,
    request?: GetRequest,
  ) {
    this.MAX_CONCURENT_REQUESTS = maxConcurrentRequests;
    this.handleResponse = handleResponse;
    this.handleError = handleError;
    this.buildUrl = buildUrl;
    this.calculateRequestConcurency = calculateRequestConcurency;
    this.divideQueryParams = divideQueryParams;
    if (request) {
      this.request = request;
    }
  }

  public async call(params: ObjectType): Promise<T | T[] | undefined> {
    const concurency = this.calculateRequestConcurency(params);
    if (concurency > Number(this.MAX_CONCURENT_REQUESTS)) {
      throw new HTTPInternalError();
    }
    try {
      return concurency === 1
        ? await this.getData(params)
        : (await Promise.allSettled(this.divideQueryParams(params, concurency)
          .map((dividedParams) => this.getData(dividedParams))) as unknown as T[]); // FIXME typing
    } catch (error) {
      this.handleError(error);
    }
  }

  private async getData(params: ObjectType): Promise<T> {
    const url = this.buildUrl(params);
    const response = await this.request(url);
    return this.handleResponse(response);
  }
}
