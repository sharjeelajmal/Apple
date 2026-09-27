import fs from 'fs';

const html = fs.readFileSync('Source Page/apple/index.html', 'utf-8');

function clean(str) {
  return str ? str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

console.log('=== HERO TILES IN SOURCE PAGE ===');
const heroMatch = html.match(/<section class="section section-hero"[\s\S]*?<\/section>/i)?.[0] || '';
const heroTiles = heroMatch.split('<div class="tile-wrapper').slice(1);
heroTiles.forEach((t, i) => {
  const id = t.match(/data-tile-id="([^"]*)"/)?.[1];
  const h2 = t.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1];
  const p = t.match(/<p class="tile-subhead[^"]*">([\s\S]*?)<\/p>/i)?.[1];
  const img = t.match(/<img[^>]+src="([^"]*)"[^>]*>/i)?.[1];
  console.log(`Hero ${i+1}: ID=${id}, Title="${clean(h2)}", Subhead="${clean(p)}", Image="${img}"`);
});

console.log('\n=== PROMO TILES IN SOURCE PAGE ===');
const promoMatch = html.match(/<section class="section section-promo"[\s\S]*?<\/section>/i)?.[0] || '';
const promoTiles = promoMatch.split('<div class="tile-wrapper').slice(1);
promoTiles.forEach((t, i) => {
  const id = t.match(/data-tile-id="([^"]*)"/)?.[1];
  const h3 = t.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)?.[1];
  const p = t.match(/<p class="tile-subhead[^"]*">([\s\S]*?)<\/p>/i)?.[1];
  const img = t.match(/<img[^>]+src="([^"]*)"[^>]*>/i)?.[1];
  console.log(`Promo ${i+1}: ID=${id}, Title="${clean(h3)}", Subhead="${clean(p)}", Image="${img}"`);
});
