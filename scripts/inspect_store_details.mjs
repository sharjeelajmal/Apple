import fs from 'fs';

const html = fs.readFileSync('Source Page/store.html', 'utf-8');

// Let's find product categories list
const navItems = [];
const navRegex = /<li[^>]*class="[^"]*rf-productnav-carditem[^"]*"[^>]*>[\s\S]*?<\/li>/gi;
const navMatches = html.match(navRegex) || [];
console.log('Product nav card items found:', navMatches.length);

if (navMatches.length === 0) {
  // Try another regex for category tiles
  const catRegex = /<a[^>]+href="([^"]*)"[^>]*class="[^"]*rf-productnav-card-title[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = catRegex.exec(html)) !== null) {
    console.log('Category Tile:', m[2].replace(/<[^>]+>/g, '').trim(), '->', m[1]);
  }
}

// Let's find the main store banner text
const storeHeaderMatch = html.match(/<div class="rs-shop-header[^"]*"[^>]*>([\s\S]*?)<\/div>/i) || html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
console.log('\nStore Header:', storeHeaderMatch ? storeHeaderMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : 'none');

// Let's find all cards in "The latest" section
const shelfRegex = /<div class="rf-cardsheet-container[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
const cardsheets = html.match(shelfRegex) || [];
console.log('\nCardsheet containers found:', cardsheets.length);
