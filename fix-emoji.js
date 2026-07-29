const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'site', 'index.html');
let html = fs.readFileSync(filePath, 'utf-8');

// ── Fix all corrupted emoji ──────────────────────────

// 1. Favicon — replace with SVG drop icon
html = html.replace(
  /<link rel="icon" href="data:image\/svg\+xml,<svg xmlns='http:\/\/www\.w3\.org\/2000\/svg' viewBox='0 0 100 100'><text y='\.9em' font-size='90'>[^<]+<\/text><\/svg>">/,
  `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>\\u{1f9f9}</text></svg>">`
);

// 2. Category icons
html = html.replace(/<span class="cat-icon">钒¿?<\/span>/, '<span class="cat-icon">⚡</span>');
html = html.replace(/<span class="cat-icon">钀¿?<\/span>/, '<span class="cat-icon">🔥</span>');
html = html.replace(/<span class="cat-icon">駃救?<\/span>/, '<span class="cat-icon">🔧</span>');
html = html.replace(/<span class="cat-icon">駃微?<\/span>/, '<span class="cat-icon">🏭</span>');

// 3. Trust icons
html = html.replace(/<span class="trust-icon">駃敩<\/span>/, '<span class="trust-icon">🔍</span>');
html = html.replace(/<span class="trust-icon">駃挵<\/span>/, '<span class="trust-icon">💰</span>');
html = html.replace(/<span class="trust-icon">駃搳<\/span>/, '<span class="trust-icon">📊</span>');

// 4. JS catEmoji — fix the emoji in JavaScript
html = html.replace(
  /const catEmoji = \{electric:'[^']*',gas:'[^']*',accessory:'[^']*',commercial:'[^']*'\}/,
  `const catEmoji = {electric:'⚡',gas:'🔥',accessory:'🔧',commercial:'🏭'}`
);

// 5. JS stars — fix the star character byte sequences
html = html.replace(
  /'鉀\?\.repeat/,
  `'★'.repeat`
);
html = html.replace(
  /'鉀\?\.repeat/g,
  `'☆'.repeat`
);

fs.writeFileSync(filePath, html, 'utf-8');
console.log('Fixed emoji in index.html');
