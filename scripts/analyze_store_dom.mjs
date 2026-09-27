import fs from 'fs';

const html = fs.readFileSync('Source Page/store.html', 'utf-8');

// Find all elements with rf- or rs- or as- classes
const classMatches = html.match(/class="([^"]*)"/gi) || [];
const uniqueClasses = new Set();
classMatches.forEach(c => {
  const cls = c.replace(/class="|"/g, '').split(' ');
  cls.forEach(cl => uniqueClasses.add(cl));
});
console.log('Total unique classes in store.html:', uniqueClasses.size);

// Let's find all cards in store.html
const cardRegex = /<li[^>]*class="[^"]*rf-cardsheet-carditem[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
const cards = html.match(cardRegex) || [];
console.log('rf-cardsheet-carditem count:', cards.length);

if (cards.length === 0) {
  // Let's look for shelves and cards
  const shelfMatches = html.match(/<section[^>]*class="[^"]*rf-cardsheet[^"]*"[^>]*>[\s\S]*?<\/section>/gi) || html.match(/<div[^>]*class="[^"]*rf-cardsheet[^"]*"[^>]*>[\s\S]*?<\/div>/gi) || [];
  console.log('rf-cardsheet count:', shelfMatches.length);
}

// Let's dump all text inside <div id="page">
const pageMatch = html.match(/<div id="page"[\s\S]*?<\/body>/i)?.[0] || '';
console.log('Page container length:', pageMatch.length);
fs.writeFileSync('scripts/store_page_body.html', pageMatch);
console.log('Saved scripts/store_page_body.html');
