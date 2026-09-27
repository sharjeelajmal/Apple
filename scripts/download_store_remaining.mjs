import fs from 'fs';
import path from 'path';
import https from 'https';

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
  const destDir = path.join(process.cwd(), 'public', 'images', 'store', 'cards');
  
  await downloadFile('https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-business-202506?wid=800&hei=1000&fmt=p-jpg&qlt=80', path.join(destDir, 'store-card-smb.jpg'));
  await downloadFile('https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-40-refurb-202408?wid=800&hei=1000&fmt=p-jpg&qlt=80', path.join(destDir, 'store-card-refurb.jpg'));
  
  // For today and engraving, copy high quality cards
  if (fs.existsSync(path.join(destDir, 'store-card-specialist.jpg'))) {
    fs.copyFileSync(path.join(destDir, 'store-card-specialist.jpg'), path.join(destDir, 'store-card-today.jpg'));
  }
  if (fs.existsSync(path.join(destDir, 'store-card-airpodsmax.jpg'))) {
    fs.copyFileSync(path.join(destDir, 'store-card-airpodsmax.jpg'), path.join(destDir, 'store-card-engraving.jpg'));
  }

  // Check all file sizes
  const files = fs.readdirSync(destDir);
  console.log('=== Checking all files in cards/ ===');
  files.forEach(f => {
    const s = fs.statSync(path.join(destDir, f));
    console.log(`${f}: ${s.size} bytes`);
    if (s.size < 1000) {
      console.warn(`WARNING: ${f} is too small!`);
    }
  });
}

run();
