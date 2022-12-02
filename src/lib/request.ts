import https from 'https';

export const request = (url: string): Promise<JSON | Error> => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    const data = [];
  
    res.on('data', (chunk) => {
      data.push(chunk as never);
    });
  
    res.on('end', () => {
      resolve(JSON.parse(Buffer.concat(data).toString()));
    });
  }).on('error', (error) => {
    reject(error);
  })
});
