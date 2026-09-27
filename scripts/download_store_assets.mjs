import fs from 'fs';
import path from 'path';
import https from 'https';

const storeCategories = [
  {
    name: 'Mac',
    href: '/mac',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-mac-nav-202310?wid=200&hei=130&fmt=png-alpha',
    file: 'store-mac.png'
  },
  {
    name: 'iPhone',
    href: '/iphone',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-iphone-nav-202309_GEO_US?wid=200&hei=130&fmt=png-alpha',
    file: 'store-iphone.png'
  },
  {
    name: 'iPad',
    href: '/ipad',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-ipad-nav-202405?wid=200&hei=130&fmt=png-alpha',
    file: 'store-ipad.png'
  },
  {
    name: 'Apple Watch',
    href: '/watch',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-watch-nav-202309_GEO_US?wid=200&hei=130&fmt=png-alpha',
    file: 'store-watch.png'
  },
  {
    name: 'Apple Vision Pro',
    href: '/apple-vision-pro',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-vision-pro-nav-202401?wid=200&hei=130&fmt=png-alpha',
    file: 'store-vision-pro.png'
  },
  {
    name: 'AirPods',
    href: '/airpods',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-airpods-nav-202209?wid=200&hei=130&fmt=png-alpha',
    file: 'store-airpods.png'
  },
  {
    name: 'AirTag',
    href: '/airtag',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-airtags-nav-202108?wid=200&hei=130&fmt=png-alpha',
    file: 'store-airtag.png'
  },
  {
    name: 'Apple TV 4K',
    href: '/tv-home',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-appletv-nav-202210?wid=200&hei=130&fmt=png-alpha',
    file: 'store-appletv.png'
  },
  {
    name: 'HomePod',
    href: '/tv-home',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-homepod-nav-202301?wid=200&hei=130&fmt=png-alpha',
    file: 'store-homepod.png'
  },
  {
    name: 'Accessories',
    href: '/shop/accessories',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-accessories-nav-202309?wid=200&hei=130&fmt=png-alpha',
    file: 'store-accessories.png'
  },
  {
    name: 'Apple Gift Card',
    href: '/shop/gift-cards',
    url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/store-card-13-holiday-giftcards-aslink-202111?wid=200&hei=130&fmt=png-alpha',
    file: 'store-giftcard.png'
  }
];

const destDir = path.join(process.cwd(), 'public', 'images', 'store');
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
  for (const cat of storeCategories) {
    const target = path.join(destDir, cat.file);
    try {
      await downloadFile(cat.url, target);
      console.log(`Downloaded ${cat.name} -> ${cat.file}`);
    } catch (e) {
      console.error(`Failed ${cat.name}:`, e.message);
    }
  }
  console.log('All store category assets downloaded successfully!');
}

run();
