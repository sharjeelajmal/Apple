import fs from 'fs';

const shelves = JSON.parse(fs.readFileSync('scripts/parsed_shelves.json', 'utf-8'));
shelves.forEach((s, i) => {
  console.log(`\n=== SHELF ${i+1}: ${s.title} ===`);
  const uniqueCards = [];
  const seen = new Set();
  s.cards.forEach(c => {
    if (c.header && !seen.has(c.header)) {
      seen.add(c.header);
      uniqueCards.push(c);
    }
  });
  console.log(uniqueCards.slice(0, 6));
});
