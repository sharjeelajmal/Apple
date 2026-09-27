import fs from 'fs';
import https from 'https';

function fetchCss(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function main() {
  let localCss = fs.readFileSync('Source Page/apple/styles.css', 'utf-8');
  localCss = localCss.replace(/@charset[^;]+;/gi, '');

  const homeBuiltCss = await fetchCss('https://www.apple.com/v/home/a/styles/home.built.css');
  const mainBuiltCss = await fetchCss('https://www.apple.com/v/home/a/styles/main.built.css');

  let combined = `${localCss}\n\n/* === HOME BUILT CSS === */\n${homeBuiltCss.replace(/@charset[^;]+;/gi, '')}\n\n/* === MAIN BUILT CSS === */\n${mainBuiltCss.replace(/@charset[^;]+;/gi, '')}`;

  fs.mkdirSync('src/styles', { recursive: true });
  fs.writeFileSync('src/styles/apple.css', combined);
  console.log('Successfully created complete src/styles/apple.css with size:', fs.statSync('src/styles/apple.css').size);
}

main();
