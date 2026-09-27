import fs from 'fs';
import path from 'path';
import https from 'https';

const storeProducts = [
  {
    name: 'iphone-16-pro',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-iphone-16-pro-202409?wid=800&hei=1000&fmt=p-jpg',
    file: 'store-iphone-16-pro.jpg'
  },
  {
    name: 'iphone-16',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-iphone-16-202409?wid=800&hei=1000&fmt=p-jpg',
    file: 'store-iphone-16.jpg'
  },
  {
    name: 'apple-watch-s10',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-watch-s10-202409?wid=800&hei=1000&fmt=p-jpg',
    file: 'store-watch-s10.jpg'
  },
  {
    name: 'ipad-air',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-ipad-air-202405?wid=800&hei=1000&fmt=p-jpg',
    file: 'store-ipad-air.jpg'
  },
  {
    name: 'macbook-air',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-macbook-air-202402?wid=800&hei=1000&fmt=p-jpg',
    file: 'store-macbook-air.jpg'
  },
  {
    name: 'specialist-help',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-specialist-help-202309?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-specialist.jpg'
  },
  {
    name: 'trade-in',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-trade-in-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-trade-in.jpg'
  },
  {
    name: 'apple-card',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-apple-card-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-apple-card.jpg'
  },
  {
    name: 'engraving',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-personalize-202108?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-engraving.jpg'
  },
  {
    name: 'magsafe-accessories',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-accessories-202409?wid=800&hei=1000&fmt=p-jpg',
    file: 'store-magsafe.jpg'
  },
  {
    name: 'airpods-max',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-airpods-max-202409?wid=800&hei=1000&fmt=p-jpg',
    file: 'store-airpods-max.jpg'
  },
  {
    name: 'homepod',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-homepod-202301?wid=800&hei=1000&fmt=p-jpg',
    file: 'store-homepod.jpg'
  },
  {
    name: 'apple-intelligence',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-apple-intelligence-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-intelligence.jpg'
  },
  {
    name: 'apple-one',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-apple-one-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-apple-one.jpg'
  }
];

const destDir = path.join(process.cwd(), 'public', 'images', 'store', 'products');
fs.mkdirSync(destDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(dest);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const prod of storeProducts) {
    const target = path.join(destDir, prod.file);
    try {
      await downloadFile(prod.url, target);
      console.log(`Downloaded ${prod.name} -> ${prod.file}`);
    } catch (e) {
      console.error(`Failed ${prod.name}:`, e.message);
    }
  }
  console.log('All store product assets downloaded successfully!');
}

run();
