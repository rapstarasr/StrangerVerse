/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(__dirname, '../public');

const writeFile = (filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created ${path.relative(publicDir, filePath)}`);
};

const createSvgFile = (name, content) => writeFile(path.join(publicDir, name), content);

const ogImage = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="StrangerVerse preview">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050816" />
      <stop offset="45%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="55%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#f472b6" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <g opacity="0.18">
    <circle cx="240" cy="320" r="220" fill="#38bdf8" />
    <circle cx="560" cy="160" r="100" fill="#f472b6" />
    <path d="M860 150c80-30 140 10 160 50" stroke="#8b5cf6" stroke-width="18" stroke-linecap="round" fill="none" />
  </g>
  <rect x="80" y="90" width="420" height="450" rx="48" fill="#0f172a" stroke="url(#brand)" stroke-width="4" />
  <circle cx="290" cy="315" r="160" fill="url(#brand)" fill-opacity="0.12" />
  <circle cx="290" cy="315" r="126" stroke="url(#brand)" stroke-width="16" fill="none" opacity="0.9" />
  <path d="M186 330c22-40 68-68 116-74 24-3 46 1 65 13 24 15 37 38 36 63" fill="none" stroke="#38bdf8" stroke-width="14" stroke-linecap="round" opacity="0.35" />
  <path d="M160 358c22-24 52-40 86-44 22-3 42 0 60 10 24 14 42 34 52 58" fill="none" stroke="#8b5cf6" stroke-width="14" stroke-linecap="round" opacity="0.25" />
  <circle cx="214" cy="292" r="24" fill="#ffffff" fill-opacity="0.95" />
  <path d="M194 338c0-14 11-25 25-25s25 11 25 25v18h-50v-18Z" fill="#ffffff" fill-opacity="0.85" />
  <circle cx="318" cy="276" r="22" fill="#ffffff" fill-opacity="0.95" />
  <path d="M300 308c0-12 9.5-21.5 21.5-21.5S343 296 343 308v15h-43v-15Z" fill="#ffffff" fill-opacity="0.85" />
  <path d="M326 360h78a18 18 0 0 1 18 18v30a14 14 0 0 1-14 14H340l-18 16v-16h-6a18 18 0 0 1-18-18v-28a18 18 0 0 1 18-18Z" fill="url(#brand)" opacity="0.28" />
  <path d="M334 368h62a12 12 0 0 1 12 12v24a9 9 0 0 1-9 9H334l-12 10v-10h-4a12 12 0 0 1-12-12v-18a12 12 0 0 1 12-12Z" fill="none" stroke="url(#brand)" stroke-width="8" opacity="0.5" stroke-linejoin="round" />
  <path d="M182 210c21-14 46-18 70-12" fill="none" stroke="#f472b6" stroke-width="10" stroke-linecap="round" opacity="0.42" />
  <path d="M260 125c0 8-6 16-14 16s-14-8-14-16 6-16 14-16 14 8 14 16Z" fill="#ffffff" opacity="0.14" />
  <text x="540" y="240" fill="#f8fafc" font-family="Inter, system-ui, sans-serif" font-size="58" font-weight="700">StrangerVerse</text>
  <text x="540" y="320" fill="#cbd5e1" font-family="Inter, system-ui, sans-serif" font-size="28" letter-spacing="0.02em">Anonymous chat for the world — text, voice, and video.</text>
  <text x="540" y="380" fill="#94a3b8" font-family="Inter, system-ui, sans-serif" font-size="22">Connect instantly with strangers in a premium global messaging experience.</text>
</svg>
`;

const favicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="StrangerVerse icon">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#f472b6" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#050816" />
  <circle cx="32" cy="28" r="14" fill="url(#g)" fill-opacity="0.14" />
  <path d="M17 29c0-6 5-11 11-11s11 5 11 11-5 11-11 11-11-5-11-11Z" fill="none" stroke="url(#g)" stroke-width="2.5" opacity="0.9" />
  <path d="M16 34c4-6 11-10 18-10s14 4 18 10" fill="none" stroke="#8b5cf6" stroke-width="1.5" opacity="0.55" />
  <circle cx="23" cy="24" r="4" fill="#fff" />
  <path d="M19 31c0-2.8 2.2-5 5-5s5 2.2 5 5v1.5h-10V31Z" fill="#fff" opacity="0.88" />
  <circle cx="40" cy="22" r="3.5" fill="#fff" />
  <path d="M38 28c0-2.2 1.8-4 4-4s4 1.8 4 4v1h-8v-1Z" fill="#fff" opacity="0.88" />
  <path d="M40 39h14a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5H42l-4 4v-4H36a5 5 0 0 1-5-5v-6a5 5 0 0 1 5-5Z" fill="url(#g)" fill-opacity="0.2" stroke="url(#g)" stroke-width="1.5" stroke-linejoin="round" />
</svg>
`;

const appleIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-label="StrangerVerse icon">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#f472b6" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="36" fill="#050816" />
  <circle cx="90" cy="90" r="74" fill="url(#g)" fill-opacity="0.12" />
  <circle cx="90" cy="90" r="58" stroke="url(#g)" stroke-width="14" fill="none" opacity="0.92" />
  <circle cx="72" cy="82" r="12" fill="#fff" />
  <path d="M62 108c0-12 9.5-22 21.5-22S105 96 105 108v20H62v-20Z" fill="#fff" fill-opacity="0.84" />
  <circle cx="110" cy="78" r="10" fill="#fff" />
  <path d="M102 98c0-8 6.5-14.5 14.5-14.5S131 90 131 98v14h-29v-14Z" fill="#fff" fill-opacity="0.84" />
  <path d="M107 120h44a12 12 0 0 1 12 12v20a10 10 0 0 1-10 10H117l-16 14v-14h-6a12 12 0 0 1-12-12v-18a12 12 0 0 1 12-12Z" fill="url(#g)" opacity="0.28" />
</svg>
`;

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="StrangerVerse logo">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#f472b6" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="48" fill="#050816" />
  <circle cx="128" cy="128" r="90" fill="url(#g)" fill-opacity="0.12" />
  <circle cx="128" cy="128" r="78" stroke="url(#g)" stroke-width="18" fill="none" opacity="0.88" />
  <path d="M70 126c8-20 26-35 47-40 16-4 32-2 46 8 18 12 29 32 29 54" fill="none" stroke="#38bdf8" stroke-width="14" stroke-linecap="round" opacity="0.32" />
  <path d="M62 166c12-18 32-30 54-34 18-3 34 0 48 10 18 12 32 30 38 52" fill="none" stroke="#8b5cf6" stroke-width="14" stroke-linecap="round" opacity="0.24" />
  <circle cx="92" cy="118" r="20" fill="#fff" fill-opacity="0.95" />
  <path d="M80 150c0-12 10-22 22-22s22 10 22 22v18H80v-18Z" fill="#fff" fill-opacity="0.86" />
  <circle cx="160" cy="110" r="18" fill="#fff" fill-opacity="0.95" />
  <path d="M150 136c0-10 8.5-18.5 18.5-18.5s18.5 8.5 18.5 18.5v14h-37v-14Z" fill="#fff" fill-opacity="0.86" />
  <path d="M168 166h60a20 20 0 0 1 20 20v34a16 16 0 0 1-16 16H178l-22 20v-20h-6a20 20 0 0 1-20-20v-30a20 20 0 0 1 20-20Z" fill="url(#g)" opacity="0.26" />
  <path d="M178 174h50a14 14 0 0 1 14 14v28a11 11 0 0 1-11 11H178l-16 14v-14h-4a14 14 0 0 1-14-14v-21a14 14 0 0 1 14-14Z" fill="none" stroke="url(#g)" stroke-width="10" opacity="0.48" stroke-linejoin="round" />
</svg>
`;

createSvgFile('og-image.svg', ogImage);
createSvgFile('og-image.png', ogImage);
createSvgFile('favicon.svg', favicon);
createSvgFile('apple-touch-icon.png', appleIcon);
createSvgFile('logo.png', logoSvg);

console.log('Public asset generation completed.');
