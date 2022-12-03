import request from 'supertest';
import { application } from '../../src';
import { request as getRequest } from '../../src/lib/request';

jest.mock('../../src/lib/request');

describe('Nasa router test', () => {
  let app;

  beforeAll(() => {
    app = request.agent(application.listen(process.env.PORT));
  });

  it('Should response with status code 400', async () => {
    const response = await app.get('/').send();

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it('Should response with status code 200', async () => {
    (getRequest as jest.Mock).mockResolvedValueOnce([{
      hdurl: "https://apod.nasa.gov/apod/image/1901/sombrero_spitzer_3000.jpg",
    }]);

    const response = await app
      .get('/?startDate=2019-01-01&endDate=2019-01-01')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });

  it('Should response with status code 503', async () => {
    (getRequest as jest.Mock).mockImplementation(async () => new Promise((res) => {
      setTimeout(() => {
        res([{ hdurl: "https://apod.nasa.gov/apod/image/1901/sombrero_spitzer_3000.jpg"} ])
      }, 0)
    }));

    const response = await app
      .get('/?startDate=2010-01-01&endDate=2019-01-01')
      .send();
    
    expect(response.status).toBe(503);
    expect(response.body).toMatchSnapshot();
  });

  it('Should response with status code 503', async () => {
    (getRequest as jest.Mock).mockImplementation(async () => new Promise((res) => {
      setTimeout(() => {
        res([{ hdurl: "https://apod.nasa.gov/apod/image/1901/sombrero_spitzer_3000.jpg"} ])
      }, 1000)
    }));

    const response = await Promise.all([
      app.get('/?startDate=2018-01-01&endDate=2019-01-01').send(),
      app.get('/?startDate=2017-01-01&endDate=2018-01-01').send(),
      app.get('/?startDate=2016-01-01&endDate=2017-01-01').send(),
      app.get('/?startDate=2015-01-01&endDate=2016-01-01').send(),
      app.get('/?startDate=2014-01-01&endDate=2015-01-01').send(),
      app.get('/?startDate=2013-01-01&endDate=2014-01-01').send(),
    ]);
    
    expect(response).toBeDefined();
    expect(response[5].status).toBe(503);
    expect(response[5].body).toMatchSnapshot();
  });
});
