import fs from 'fs';

const html = fs.readFileSync('Source Page/apple/index.html', 'utf-8');

// Extract Header
const header = html.match(/<nav id="globalnav"[\s\S]*?<\/nav>/i)?.[0];
console.log('=== HEADER EXTRACTED === (length:', header?.length, ')');

// Extract Footer
const footer = html.match(/<footer id="ac-globalfooter"[\s\S]*?<\/footer>/i)?.[0];
console.log('=== FOOTER EXTRACTED === (length:', footer?.length, ')');
fs.writeFileSync('scripts/extracted_header.html', header || '');
fs.writeFileSync('scripts/extracted_footer.html', footer || '');
console.log('Saved extracted_header.html and extracted_footer.html');
