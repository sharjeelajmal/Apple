import fs from 'fs';
import path from 'path';
import https from 'https';

const imagesToDownload = [
  {
    name: 'iphone17pro',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-iphone-16-pro-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-iphone17pro.jpg'
  },
  {
    name: 'iphoneair',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-iphone-16-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-iphoneair.jpg'
  },
  {
    name: 'watch11',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-watch-s10-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-watch11.jpg'
  },
  {
    name: 'ipadair',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-ipad-air-202405?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-ipadair.jpg'
  },
  {
    name: 'macbookair',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-macbook-air-202402?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-macbookair.jpg'
  },
  {
    name: 'specialist',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-specialist-help-202309?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-specialist.jpg'
  },
  {
    name: 'today',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-today-at-apple-202108?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-today.jpg'
  },
  {
    name: 'personal_setup',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-personal-setup-202108?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-personalsetup.jpg'
  },
  {
    name: 'genius',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-genius-202108?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-genius.jpg'
  },
  {
    name: 'tradein',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-trade-in-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-tradein.jpg'
  },
  {
    name: 'applecard',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-apple-card-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-applecard.jpg'
  },
  {
    name: 'engraving',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-personalize-202108?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-engraving.jpg'
  },
  {
    name: 'magsafe',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-accessories-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-magsafe.jpg'
  },
  {
    name: 'airpodsmax',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-airpods-max-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-airpodsmax.jpg'
  },
  {
    name: 'homepod',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-40-homepod-202301?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-homepod.jpg'
  },
  {
    name: 'intelligence',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-apple-intelligence-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-intelligence.jpg'
  },
  {
    name: 'appleone',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-apple-one-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-appleone.jpg'
  },
  {
    name: 'edu',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-bts-edu-macbook-air-ipad-air-202406?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-edu.jpg'
  },
  {
    name: 'business',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-smb-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-smb.jpg'
  },
  {
    name: 'refurb',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-50-refurb-202409?wid=960&hei=1000&fmt=p-jpg',
    file: 'store-card-refurb.jpg'
  }
];

const destDir = path.join(process.cwd(), 'public', 'images', 'store', 'cards');
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

async function main() {
  for (const item of imagesToDownload) {
    const target = path.join(destDir, item.file);
    try {
      await downloadFile(item.url, target);
      console.log(`Downloaded ${item.name} -> ${item.file}`);
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
    }
  }
  console.log('All store card images downloaded successfully!');
}

main();
