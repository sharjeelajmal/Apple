import fs from 'fs';
import path from 'path';
import https from 'https';

const assets = [
  // Logos
  {
    url: 'https://www.apple.com/v/home/images/logos/ipad-air-m4/a/promo_logo_ipad_air__dqdj4ni03quu_large.png',
    dest: 'public/images/logos/promo_logo_ipad_air.png'
  },
  {
    url: 'https://www.apple.com/v/home/images/logos/apple-watch-series-11/a/promo_logo_apple_watch_series_11__5r9c4l119tuy_large.png',
    dest: 'public/images/logos/promo_logo_apple_watch_series_11.png'
  },
  {
    url: 'https://www.apple.com/v/home/images/logos/iphone-tradein/a/promo_logo_iphone_tradein__bb7assu7ubo2_large.png',
    dest: 'public/images/logos/promo_logo_iphone_tradein.png'
  },
  {
    url: 'https://www.apple.com/v/home/images/logos/apple-card/a/promo_logo_apple_card__28vxrcexz0ia_large.png',
    dest: 'public/images/logos/promo_logo_apple_card.png'
  },
  // Promo Images
  {
    url: 'https://www.apple.com/v/home/images/ipad-air-m4/a/promo_ipad_air_m4__bgcv7t286k8y_large.jpg',
    dest: 'public/images/promo/promo_ipad_air_m4.jpg'
  },
  {
    url: 'https://www.apple.com/v/home/images/macbook-pro/a/promo_macbook_pro__c9td9w1mc8ia_large.jpg',
    dest: 'public/images/promo/promo_macbook_pro.jpg'
  },
  {
    url: 'https://www.apple.com/v/home/images/apple-watch-series-11/a/promo_apple_watch_series_11__gnlwqxe1jlu2_large.jpg',
    dest: 'public/images/promo/promo_apple_watch_series_11.jpg'
  },
  {
    url: 'https://www.apple.com/v/home/images/ipad-pro/a/promo_ipad_pro__emtduc920o02_large.jpg',
    dest: 'public/images/promo/promo_ipad_pro.jpg'
  },
  {
    url: 'https://www.apple.com/v/home/images/iphone-tradein/a/promo_iphone_tradein__e4hrjxmgmf0i_large.jpg',
    dest: 'public/images/promo/promo_iphone_tradein.jpg'
  },
  {
    url: 'https://www.apple.com/v/home/images/apple-card/a/promo_apple_card__d8xz4kd4evwy_large.jpg',
    dest: 'public/images/promo/promo_apple_card.jpg'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Referer': 'https://www.apple.com/'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Saved: ${dest} (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const item of assets) {
    try {
      await download(item.url, item.dest);
    } catch (e) {
      console.error(`Error downloading ${item.url}:`, e.message);
    }
  }
}

main();
