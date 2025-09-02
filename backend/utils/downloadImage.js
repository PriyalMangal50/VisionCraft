import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

export function downloadImage(url, destFolder, fileName) {
  return new Promise((resolve, reject) => {
    try {
      fs.mkdirSync(destFolder, { recursive: true });
      const ext = path.extname(new URL(url).pathname) || '.jpg';
      const target = path.join(destFolder, `${fileName}${ext}`);
      const client = url.startsWith('https') ? https : http;

      const request = client.get(url, (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        }
        const fileStream = fs.createWriteStream(target);
        response.pipe(fileStream);
        fileStream.on('finish', () => fileStream.close(() => resolve(target)));
      });
      request.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
}

export default downloadImage;
