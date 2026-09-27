import fs from 'fs';

const html = fs.readFileSync('Source Page/store.html', 'utf-8');

// Find all image URLs in store.html
const imgRegex = /https:\/\/store\.storeimages\.cdn-apple\.com\/[^\s\"\'\>\)]+/gi;
const allImgUrls = [...new Set(html.match(imgRegex) || [])];
console.log('Total store image URLs found:', allImgUrls.length);

fs.writeFileSync('scripts/store_images.json', JSON.stringify(allImgUrls, null, 2));
console.log('Saved scripts/store_images.json. First 15 images:');
console.log(allImgUrls.slice(0, 15));
