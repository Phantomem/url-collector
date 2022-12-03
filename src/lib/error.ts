
export type ValidationContext = {
  value: string,
  msg: string,
  param: string,
  location: string,
}
export interface HTTPError extends Error {
  code: number;
  error: string;
}
export interface HTTPValidationError<ContextType> extends HTTPError {
  context: ContextType;
}

export class HTTPError extends Error {
  constructor(code: number, message?: string) {
    super(message);
    this.error = 'HTTP Error';
    this.code = code;
  }

  toMessage() {
    return { ...this };
  }
}

export class HTTPValidationError<ContextType> extends HTTPError {
  constructor(context: ContextType) {
    super(400);
    this.error = 'Validation Error';
    this.context = context;
  }
}

export class HTTPUnavailableError extends HTTPError {
  constructor() {
    super(503);
    this.error = 'Unavailable Error';
  }
}

export class HTTPInternalError extends HTTPError {
  constructor() {
    super(500);
    this.error = 'Internal Server Error';
  }
}
