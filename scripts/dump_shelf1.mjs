import fs from 'fs';

const html = fs.readFileSync('scripts/store_page_body.html', 'utf-8');
const idx = html.indexOf('The latest.');
const shelf1Html = html.slice(idx, idx + 25000);

// Let's find all cards in Shelf 1
const cardRegex = /<div class="rf-cards-scroller-item[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
let m;
let i = 0;
while ((m = cardRegex.exec(shelf1Html)) !== null && i < 10) {
  i++;
  console.log(`\n--- Card ${i} ---`);
  console.log(m[0].slice(0, 500));
}
