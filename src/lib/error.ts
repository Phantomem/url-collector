
export type ValidationContext = {
  value: string,
  msg: string,
  param: string,
  location: string,
}
export interface HTTPError extends Error {
  code: number;
}
export interface HTTPValidationError<ContextType> extends HTTPError {
  context: ContextType;
}

export class HTTPError extends Error {
  constructor(code: number, message?: string) {
    super(message);
    this.name = 'Error';
    this.code = code;
  }

  toMessage() {
    return { ...this };
  }
}

export class HTTPValidationError<ContextType> extends HTTPError {
  constructor(context: ContextType) {
    super(400);
    this.name = 'Validation Error';
    this.context = context;
  }
}

export class HTTPInternalError extends HTTPError {
  constructor() {
    super(500);
    this.name = 'Internal Server Error';
  }
}
