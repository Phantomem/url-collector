import https from 'https';

export const request = <T>(url: string): Promise<T> => 
  new Promise<T>((resolve, reject) => {
    https.get(url, (res) => {
      const data: Uint8Array[] = [];
    
      res.on('data', (chunk) => {
        data.push(chunk as never);
      });
    
      res.on('end', () => {
        try {
          const json = JSON.parse(Buffer.concat(data).toString());
          resolve(json as T);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    })
  });
