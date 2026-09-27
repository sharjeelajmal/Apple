import fs from 'fs';
import path from 'path';
import https from 'https';

const allImgs = JSON.parse(fs.readFileSync('scripts/store_images.json', 'utf-8'));

function findUrl(pattern) {
  return allImgs.find(u => u.includes(pattern) && (u.includes('fmt=p-jpg') || u.includes('fmt=jpeg') || u.includes('fmt=png')));
}

const cardsToDownload = [
  { name: 'store-card-iphone17pro.jpg', pattern: 'store-card-40-iphone-17-pro' },
  { name: 'store-card-iphoneair.jpg', pattern: 'store-card-40-iphone-17e' },
  { name: 'store-card-watch11.jpg', pattern: 'store-card-40-watch-s11' },
  { name: 'store-card-ipadair.jpg', pattern: 'store-card-40-ipad-air' },
  { name: 'store-card-macbookair.jpg', pattern: 'store-card-40-macbook-neo' },
  { name: 'store-card-specialist.jpg', pattern: 'specialist' },
  { name: 'store-card-today.jpg', pattern: 'today' },
  { name: 'store-card-personalsetup.jpg', pattern: 'setup' },
  { name: 'store-card-genius.jpg', pattern: 'genius' },
  { name: 'store-card-tradein.jpg', pattern: 'trade' },
  { name: 'store-card-applecard.jpg', pattern: 'card' },
  { name: 'store-card-engraving.jpg', pattern: 'personalize' },
  { name: 'store-card-magsafe.jpg', pattern: 'accessories' },
  { name: 'store-card-airpodsmax.jpg', pattern: 'airpods-max' },
  { name: 'store-card-homepod.jpg', pattern: 'homepod' },
  { name: 'store-card-intelligence.jpg', pattern: 'intelligence' },
  { name: 'store-card-appleone.jpg', pattern: 'one' },
  { name: 'store-card-edu.jpg', pattern: 'edu' },
  { name: 'store-card-smb.jpg', pattern: 'smb' },
  { name: 'store-card-refurb.jpg', pattern: 'refurb' }
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
  for (const c of cardsToDownload) {
    let url = findUrl(c.pattern);
    if (!url) {
      // fallback search any
      url = allImgs.find(u => u.toLowerCase().includes(c.pattern));
    }
    if (url) {
      const dest = path.join(destDir, c.name);
      try {
        await downloadFile(url, dest);
        const stats = fs.statSync(dest);
        console.log(`Saved ${c.name} (${stats.size} bytes) from ${url.slice(0, 70)}...`);
      } catch (err) {
        console.error(`Error downloading ${c.name}:`, err.message);
      }
    } else {
      console.log(`No matching URL for ${c.pattern}`);
    }
  }
}

main();
