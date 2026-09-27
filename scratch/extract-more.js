const fs = require('fs');
const html = fs.readFileSync('d:\\WebsiteDevlopment\\apple\\Source Page\\apple\\home.html', 'utf8');

function extractSection(id) {
    const startIndex = html.indexOf(`id="${id}"`);
    if (startIndex === -1) return null;
    
    const divStart = html.lastIndexOf('<div', startIndex);
    
    let depth = 0;
    let i = divStart;
    
    while (i < html.length) {
        if (html.slice(i, i+4) === '<div') {
            depth++;
            i += 4;
        } else if (html.slice(i, i+5) === '</div') {
            depth--;
            i += 5;
            if (depth === 0) {
                return html.substring(divStart, i + 6);
            }
        } else {
            i++;
        }
    }
    return html.substring(divStart, i);
}

const sections = [
  'shopify-section-header',
  'shopify-section-footer_3',
  'shopify-section-template--14488879071291__1643607476d1b5f1fa', // Trending Products
  'shopify-section-template--14488879071291__16436854210574d074', // Featured Products
  'shopify-section-template--14488879071291__16436097382cb19221', // Testimonials
  'shopify-section-template--14488879071291__16436929260056671b'  // Newsletter
];

sections.forEach(sec => {
    const content = extractSection(sec);
    if (content) {
        fs.writeFileSync(`d:\\WebsiteDevlopment\\apple\\scratch\\${sec}.html`, content);
        console.log("Extracted: " + sec);
    }
});
