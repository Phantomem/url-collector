import express, { Router, Express, ErrorRequestHandler, RequestHandler } from 'express';
import queryString from 'query-string';

export class Server {
  private app: Express;
  private timeout = 120000;
  private errorHandlers: ErrorRequestHandler[];
  constructor(timeout?: number) {
    this.timeout = timeout || this.timeout;
    this.app = express();
  }

  public static create(timeout?: number): Server {
    return new Server(timeout);
  }

  public registerErrorHandlers(errorHandlers: ErrorRequestHandler[]) {
    this.errorHandlers = errorHandlers;
    return this;
  }

  public addRoutes(routes: Router[]): Server {
    routes.forEach((route) => this.app.use(route));
    return this;
  }

  public registerMiddleware(fn: RequestHandler): Server {
    this.app.use(fn);
    return this;
  }

  public enableQueryParser(): Server {
    this.app.set('query parser', (str) => queryString.parse(str));
    return this;
  }

  public build(): Express {
    this.app.use(...this.errorHandlers);

    return this.app;
  }
}
