import fs from 'fs';

const allImgs = JSON.parse(fs.readFileSync('scripts/store_images.json', 'utf-8'));
console.log('Total store images:', allImgs.length);

const keywords = ['trade', 'card', 'personalize', 'engrav', 'today', 'setup', 'intelligence', 'one', 'edu', 'smb', 'refurb', 'specialist', 'genius', 'magsafe', 'airpod', 'homepod', 'iphone', 'watch', 'ipad', 'mac'];

keywords.forEach(k => {
  const matches = allImgs.filter(url => url.toLowerCase().includes(k));
  console.log(`\n=== Keyword: ${k} (Matches: ${matches.length}) ===`);
  matches.slice(0, 5).forEach(m => console.log('  ', m));
});
