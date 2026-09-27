const fs = require('fs');
const html = fs.readFileSync('d:\\WebsiteDevlopment\\apple\\Source Page\\apple\\home.html', 'utf8');

// Simple regex to extract the contents of div with id="shopify-section-..."
// Since HTML can have nested divs, we use a simple balanced tag extractor
function extractSection(id) {
    const startIndex = html.indexOf(`id="${id}"`);
    if (startIndex === -1) return null;
    
    // Find the opening <div of this section
    const divStart = html.lastIndexOf('<div', startIndex);
    
    let depth = 0;
    let i = divStart;
    let inTag = false;
    let isClosing = false;
    
    while (i < html.length) {
        if (html.slice(i, i+4) === '<div') {
            depth++;
            i += 4;
        } else if (html.slice(i, i+5) === '</div') {
            depth--;
            i += 5;
            if (depth === 0) {
                return html.substring(divStart, i + 1);
            }
        } else {
            i++;
        }
    }
    return html.substring(divStart, i);
}

const sections = [
  'shopify-section-header',
  'shopify-section-template--14488879071291__16272984271dd9cdb1',
  'shopify-section-template--14488879071291__16435218392d081d91',
  'shopify-section-template--14488879071291__1627298270f9df5a4e'
];

sections.forEach(sec => {
    fs.writeFileSync(`d:\\WebsiteDevlopment\\apple\\scratch\\${sec}.html`, extractSection(sec) || '');
});
console.log("Sections extracted.");
