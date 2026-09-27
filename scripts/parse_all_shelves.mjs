import fs from 'fs';

const html = fs.readFileSync('scripts/store_page_body.html', 'utf-8');

// Find all noscript sections that contain shelves
const shelves = [];
const shelfRegex = /<div class="as-l-container rs-cardsshelf-section-top rs-cards-shelf-header">([\s\S]*?)<\/h2>[\s\S]*?<span class="rs-cards-shelf-secondaryheader">([\s\S]*?)<\/span>[\s\S]*?<div class="rf-cards-scroller-platter">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/gi;

let m;
let count = 0;
while ((m = shelfRegex.exec(html)) !== null) {
  count++;
  const title = m[1].replace(/<[^>]+>/g, '').trim();
  const subtitle = m[2].replace(/<[^>]+>/g, '').trim();
  const platterHtml = m[3];
  
  // Extract cards
  const cardMatches = platterHtml.split('<div class="rf-ccard').slice(1);
  const cardData = cardMatches.map(c => {
    const link = c.match(/href="([^"]*)"/)?.[1];
    const header = c.match(/class="rf-ccard-content-header"[^>]*>([\s\S]*?)<\/div>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const desc = c.match(/class="[^"]*rf-ccard-content-desccontent[^"]*"[^>]*>([\s\S]*?)<\/span>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const price = c.match(/class="[^"]*rf-ccard-content-descprice[^"]*"[^>]*>([\s\S]*?)<\/span>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const isDark = c.includes('theme-dark') || c.includes('rf-ccard-dark');
    return { link, header, desc, price, isDark };
  });

  shelves.push({ title, subtitle, cards: cardData });
}

console.log('Total parsed shelves:', shelves.length);
fs.writeFileSync('scripts/parsed_shelves.json', JSON.stringify(shelves, null, 2));
console.log('Saved scripts/parsed_shelves.json:');
shelves.forEach((s, i) => console.log(`Shelf ${i+1}: "${s.title}" - "${s.subtitle}" (${s.cards.length} cards)`));
