import express, { Router, Express, ErrorRequestHandler, RequestHandler } from 'express';
import { errorHandler } from './errorHandler';
import queryString from 'query-string';

export class Server {
  private port = '8080';
  private app: Express;
  private timeout = 120000;
  constructor(timeout?: number) {
    this.timeout = timeout || this.timeout;
    this.app = express();
    this.app.use(...errorHandler);
  }

  public static create(timeout?: number): Server {
    return new Server(timeout);
  }

  public registerErrorHandlers(errorHandlers: ErrorRequestHandler[]) {
    this.app.use(...errorHandlers);
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

  public setPort(port: string): Server {
    this.port = port;
    return this;
  }

  public init() {
    const server = this.app.listen(this.port, () => {
      console.info(`Server listening on port: ${this.port}`);
    });
    server.setTimeout(this.timeout);

    return server;
  }
}
