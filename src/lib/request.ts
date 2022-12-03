import https from 'https';

export const request = (url: string): Promise<JSON | Error> => new Promise((resolve, reject) => {
  https.get(url, (res) => {
    const data = [];
  
    res.on('data', (chunk) => {
      data.push(chunk as never);
    });
  
    res.on('end', () => {
      try {
        const json = JSON.parse(Buffer.concat(data).toString());
        resolve(json);
      } catch (error) {
        reject(error);
      }
    });
  }).on('error', (error) => {
    reject(error);
  })
});
