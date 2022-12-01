import https from 'https';

export type RequestResponse = JSON | Error
export type GetRequest = (string) => Promise<RequestResponse>

export const getRequest: GetRequest = (url: string): Promise<JSON | Error> => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    const data = [];
  
    res.on('data', chunk => {
      data.push(chunk as never);
    });
  
    res.on('end', () => {
      resolve(JSON.parse(Buffer.concat(data).toString()));
    });
  }).on('error', (error) => {
    reject(error);
  })
});
