import fs from 'fs';

const html = fs.readFileSync('scripts/store_page_body.html', 'utf-8');

// Find all elements with data-autom or class containing "shelf" or "card" or "slider"
const cards = [];
const cardRegex = /<div[^>]*class="[^"]*(?:card|shelf|tile|gallery|carousel)[^"]*"[^>]*>/gi;
let m;
const matchedClasses = new Set();
while ((m = cardRegex.exec(html)) !== null) {
  matchedClasses.add(m[0]);
}
console.log('Matched container tags:', [...matchedClasses].slice(0, 30));

// Let's find all headings (h1, h2, h3, h4) with their surrounding container
const headingRegex = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;
const headings = [];
while ((m = headingRegex.exec(html)) !== null) {
  headings.push({ tag: m[0], text: m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() });
}
console.log('All Headings in Store:', headings);
