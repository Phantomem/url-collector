import request from 'supertest';
import { Express } from 'express';
import { application } from '../../src';
import { getApodUrls, getRequest, getRequests } from '../../src/nasa/apodService';

jest.mock('../../src/nasa/apodService');

describe('Nasa router test', () => {
  let app: Express;

  beforeAll(() => {
    app = application;
  });

  it('Should response with status code 400', async () => {
    const response = await request(app).get('/').send();

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it('Should response with status code 200', async () => {
    (getApodUrls as jest.Mock).mockResolvedValueOnce([
      "https://apod.nasa.gov/apod/image/1901/sombrero_spitzer_3000.jpg",
    ]);

    const response = await request(app)
      .get('/?startDate=2019-01-01&endDate=2019-01-01')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot();
  });


  it('Should response with status code 503', async () => {
    (getRequests as jest.Mock).mockImplementation(() => new Promise((res) => {
      setTimeout(() => {
        console.log('2313213');
        res(["https://apod.nasa.gov/apod/image/1901/sombrero_spitzer_3000.jpg"])
      }, 1000)
    }));

    const apiRequest = request(app)
      .get('/?startDate=2010-01-01&endDate=2019-01-01')
      .send();

    const response = await Promise.all(
      Array.from({ length: 10 }).map(_ => apiRequest),
    )
    console.log(response.map(r => r.status));
    expect(response[5].status).toBe(503);
    // expect(response.body).toMatchSnapshot();
  });
});
