import fs from 'fs';
import https from 'https';

function fetch(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function run() {
  const storeHomeCss = await fetch('https://store.storeimages.cdn-apple.com/4982/store.apple.com/static-resources/rs-merch-4.19.5-d1a23/dist/store-home.css');
  console.log('store-home.css length:', storeHomeCss.length);
  fs.writeFileSync('scripts/store-home.css', storeHomeCss);

  const stepZeroCss = await fetch('https://store.storeimages.cdn-apple.com/4982/store.apple.com/shop/Catalog/global/css/dd/merch/step-zero.css');
  console.log('step-zero.css length:', stepZeroCss.length);

  const asStoreCss = await fetch('https://store.storeimages.cdn-apple.com/4982/store.apple.com/shop/Catalog/global/css/web/fee/landing-pages/as-store.css');
  console.log('as-store.css length:', asStoreCss.length);

  // Search for key classes
  const queries = [
    /\.rs-cards-shelf-mainheader[^{]*{[^}]+}/g,
    /\.rs-cards-shelf-secondaryheader[^{]*{[^}]+}/g,
    /\.rf-cards-scroller[^{]*{[^}]+}/g,
    /\.rf-ccard[^{]*{[^}]+}/g,
    /\.rf-ccard-40[^{]*{[^}]+}/g,
    /\.rf-ccard-content-header[^{]*{[^}]+}/g,
    /\.rf-ccard-content-desccontent[^{]*{[^}]+}/g,
    /\.rf-ccard-content-descprice[^{]*{[^}]+}/g,
    /\.rf-productnav-carditem[^{]*{[^}]+}/g,
    /\.rf-productnav-card-title[^{]*{[^}]+}/g
  ];

  for (const q of queries) {
    const m = storeHomeCss.match(q) || [];
    console.log('Matches for', q, ':\n', m.slice(0, 3).join('\n'));
  }
}

run();
