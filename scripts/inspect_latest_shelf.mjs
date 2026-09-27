import fs from 'fs';

const html = fs.readFileSync('scripts/store_page_body.html', 'utf-8');

// Find where "The latest." appears
const idx = html.indexOf('The latest.');
console.log('Index of "The latest.":', idx);

if (idx !== -1) {
  // Let's print 4000 characters around this section
  console.log(html.slice(idx - 200, idx + 3500));
}
