const fs = require('fs');
const html = fs.readFileSync('d:\\WebsiteDevlopment\\apple\\Source Page\\apple\\home.html', 'utf8');
const sections = html.match(/id="shopify-section-[^"]*"/g) || [];
console.log(sections);
