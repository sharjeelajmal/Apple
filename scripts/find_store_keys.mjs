import fs from 'fs';

const html = fs.readFileSync('Source Page/store.html', 'utf-8');
const regex = /https:\/\/store\.storeimages\.cdn-apple\.com\/[^\s\"\'\>\)]+/gi;
const urls = html.match(regex) || [];

['today', 'engrav', 'personalize', 'smb', 'business', 'refurb'].forEach(k => {
  const found = urls.filter(u => u.toLowerCase().includes(k));
  console.log(`Key ${k}:`, found.slice(0, 3));
});
