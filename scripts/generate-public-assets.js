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
  <rect width="1200" height="630" fill="#050816" />
  <rect x="60" y="60" width="1080" height="510" rx="42" fill="url(#bg)" />
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111827" />
      <stop offset="55%" stop-color="#1d4ed8" />
      <stop offset="100%" stop-color="#9333ea" />
    </linearGradient>
  </defs>
  <circle cx="930" cy="190" r="150" fill="#22d3ee" fill-opacity="0.22" />
  <circle cx="290" cy="470" r="180" fill="#f472b6" fill-opacity="0.19" />
  <path d="M270 250c70-78 186-78 246 0 43 57 43 140 0 196-60 78-176 78-246 0-43-56-43-139 0-196Z" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.28" />
  <path d="M310 280h118" stroke="#ffffff" stroke-width="16" stroke-linecap="round" />
  <path d="M320 330h104" stroke="#ffffff" stroke-width="16" stroke-linecap="round" />
  <path d="M308 380h120" stroke="#ffffff" stroke-width="16" stroke-linecap="round" />
  <text x="270" y="480" fill="#f8fafc" font-family="Arial, sans-serif" font-size="56" font-weight="700">StrangerVerse</text>
  <text x="270" y="535" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="28">Anonymous chat, voice, and video worldwide</text>
</svg>
`;

const favicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="StrangerVerse icon">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="50%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#f472b6" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="18" fill="#050816" />
  <path d="M20 18c8-6 20-6 28 0 5 4 8 10 8 16 0 9-6 15-13 19-2 1-4 2-6 3-2-1-4-2-6-3-7-4-13-10-13-19 0-6 3-12 8-16Z" fill="url(#g)" />
  <circle cx="28" cy="32" r="3.5" fill="#fff" />
  <circle cx="36" cy="32" r="3.5" fill="#fff" />
  <path d="M27 40c2 2 8 2 10 0" stroke="#fff" stroke-width="2.5" stroke-linecap="round" />
</svg>
`;

const appleIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-label="StrangerVerse icon">
  <rect width="180" height="180" rx="36" fill="#050816" />
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="50%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#f472b6" />
    </linearGradient>
  </defs>
  <path d="M55 45c22-16 54-16 76 0 13 10 21 25 21 41 0 24-16 41-35 52-5 2-9 3-14 4-5-2-9-3-14-4-19-11-35-28-35-52 0-16 8-31 21-41Z" fill="url(#g)" />
  <circle cx="78" cy="90" r="9" fill="#fff" />
  <circle cx="105" cy="90" r="9" fill="#fff" />
  <path d="M75 115c4 4 16 4 20 0" stroke="#fff" stroke-width="6" stroke-linecap="round" />
</svg>
`;

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="StrangerVerse logo">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22d3ee" />
      <stop offset="50%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#f472b6" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="48" fill="#050816" />
  <path d="M80 60c32-24 80-24 112 0 20 15 32 37 32 62 0 34-22 57-48 72-8 4-16 6-24 7-8-3-16-5-24-7-26-15-48-38-48-72 0-25 12-47 32-62Z" fill="url(#g)" />
  <circle cx="105" cy="120" r="14" fill="#fff" />
  <circle cx="151" cy="120" r="14" fill="#fff" />
  <path d="M100 150c5 5 20 5 25 0" stroke="#fff" stroke-width="8" stroke-linecap="round" />
  <text x="128" y="240" text-anchor="middle" fill="#cbd5e1" font-family="Arial, sans-serif" font-size="28" font-weight="700">SV</text>
</svg>
`;

createSvgFile('og-image.svg', ogImage);
createSvgFile('og-image.png', ogImage);
createSvgFile('favicon.svg', favicon);
createSvgFile('apple-touch-icon.png', appleIcon);
createSvgFile('logo.png', logoSvg);

console.log('Public asset generation completed.');
