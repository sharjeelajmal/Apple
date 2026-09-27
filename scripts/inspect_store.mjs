import fs from 'fs';

const html = fs.readFileSync('Source Page/store.html', 'utf-8');
console.log('Total store.html size:', html.length);

// Find main sections or container headings in store.html
const headings = html.match(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/gi) || [];
console.log('Headings in store.html:');
headings.forEach(h => console.log(h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));

// Let's find product categories in the horizontal category bar
const categoryLinks = html.match(/<a[^>]+class="[^"]*as-productlocator[^"]*"[^>]*>[\s\S]*?<\/a>/gi) || html.match(/<li[^>]*class="[^"]*as-navtiles[^"]*"[^>]*>[\s\S]*?<\/li>/gi) || [];
console.log('\nCategory items count:', categoryLinks.length);
