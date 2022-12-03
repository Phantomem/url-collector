import express, { Router, Express, ErrorRequestHandler, RequestHandler } from 'express';
import queryString from 'query-string';

export class Server {
  private app: Express;
  private timeout = 120000;
  private errorHandlers!: ErrorRequestHandler[];
  private routes!: Router[];
  private entryMiddlewares = [] as RequestHandler[];
  private exitMiddlewares = [] as RequestHandler[];
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
    this.routes = routes;
    return this;
  }

  public registerEntryMiddleware(...fns: RequestHandler[]): Server {
    this.entryMiddlewares = [...this.entryMiddlewares, ...fns]
    return this;
  }

  public registerExitMiddleware(...fns: RequestHandler[]): Server {
    this.exitMiddlewares = [...this.exitMiddlewares, ...fns]
    return this;
  }

  public enableQueryParser(): Server {
    this.app.set('query parser', (str: string) => queryString.parse(str));
    return this;
  }

  public build(): Express {
    if (this.entryMiddlewares.length) {
      this.app.use(...this.entryMiddlewares);
    }

    this.routes.forEach((route) => this.app.use(route));

    if (this.exitMiddlewares.length) {
      this.app.use(...this.exitMiddlewares);
    }

    if (this.errorHandlers) {
      this.app.use(...this.errorHandlers);
    }
    
    return this.app;
  }
}
