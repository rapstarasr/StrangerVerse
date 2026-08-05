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
      <stop offset="0%" stop-color="#090B17" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="40%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
    <linearGradient id="halo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.04" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <g opacity="0.18">
    <circle cx="260" cy="220" r="180" fill="#38BDF8" />
    <circle cx="760" cy="420" r="120" fill="#8B5CF6" />
  </g>
  <g transform="translate(180 120)">
    <circle cx="200" cy="180" r="148" fill="url(#halo)" />
    <path d="M84 62c12-19 34-34 60-34 36 0 64 28 64 64v18c0 6-4 10-10 10H78c-6 0-10-4-10-10V82c0-4 1-8 2-10Z" fill="#111827" />
    <path d="M176 64c0-14 10-26 24-26s24 12 24 26v12a10 10 0 0 1-10 10h-28a10 10 0 0 1-10-10V64Z" fill="#F8FAFC" opacity="0.95" />
    <path d="M108 136c0-24 20-44 44-44s44 20 44 44v16H108v-16Z" fill="#F8FAFC" opacity="0.16" />
    <path d="M68 118c16-28 44-48 76-52 30-4 58 2 80 20" fill="none" stroke="#22D3EE" stroke-width="5" opacity="0.45" stroke-linecap="round" />
    <path d="M194 90c18-6 36-6 52 0" fill="none" stroke="#8B5CF6" stroke-width="5" opacity="0.35" stroke-linecap="round" />
    <circle cx="140" cy="92" r="20" fill="#F8FAFC" />
    <circle cx="192" cy="86" r="16" fill="#F8FAFC" />
    <path d="M118 156h124a18 18 0 0 1 18 18v18a14 14 0 0 1-14 14H134l-10 12v-12H118a18 18 0 0 1-18-18v-18a18 18 0 0 1 18-18Z" fill="#22D3EE" fill-opacity="0.16" />
    <circle cx="38" cy="44" r="6" fill="#38BDF8" />
    <circle cx="218" cy="38" r="5" fill="#8B5CF6" />
    <circle cx="254" cy="178" r="4" fill="#22D3EE" />
  </g>
  <g fill="none" stroke="url(#brand)" stroke-width="10" opacity="0.28" transform="translate(80 80)">
    <ellipse cx="430" cy="280" rx="188" ry="190" />
  </g>
  <text x="520" y="260" fill="#F8FAFC" font-family="Inter, system-ui, sans-serif" font-size="58" font-weight="700">Stranger<span fill="url(#brand)">Verse</span></text>
  <text x="520" y="320" fill="#94A3B8" font-family="Inter, system-ui, sans-serif" font-size="28" letter-spacing="0.02em">A World of Strangers</text>
  <text x="520" y="364" fill="#94A3B8" font-family="Inter, system-ui, sans-serif" font-size="22">Premium anonymous chat for global connection.</text>
</svg>
`;

const favicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="StrangerVerse icon">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#090B17" />
  <circle cx="32" cy="28" r="14" fill="url(#g)" fill-opacity="0.14" />
  <path d="M17 29c0-6 5-11 11-11s11 5 11 11-5 11-11 11-11-5-11-11Z" fill="none" stroke="url(#g)" stroke-width="2.5" opacity="0.9" />
  <path d="M16 34c4-6 11-10 18-10s14 4 18 10" fill="none" stroke="#8B5CF6" stroke-width="1.5" opacity="0.55" />
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
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="36" fill="#090B17" />
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
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="45%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#090B17" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="256" height="256" rx="48" fill="#090B17" />
  <circle cx="128" cy="128" r="100" fill="url(#glow)" />
  <path d="M68 76c0-18 15-32 33-32h54c18 0 33 14 33 32v36c0 18-15 32-33 32H144l-14 16a8 8 0 0 1-12-1l-14-15H101c-18 0-33-14-33-32V76Z" fill="#111827" stroke="url(#g)" stroke-width="8" />
  <circle cx="98" cy="104" r="18" fill="#F8FAFC" />
  <circle cx="158" cy="96" r="16" fill="#F8FAFC" />
  <path d="M102 146c0-24 20-44 44-44s44 20 44 44v18H102v-18Z" fill="#F8FAFC" fill-opacity="0.16" />
  <ellipse cx="128" cy="126" rx="84" ry="86" fill="none" stroke="url(#g)" stroke-width="8" opacity="0.28" />
  <path d="M52 54c40-28 102-28 142 0" fill="none" stroke="#38BDF8" stroke-width="6" opacity="0.22" stroke-linecap="round" />
</svg>
`;

const logoTransparentSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="StrangerVerse transparent logo">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="45%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#090B17" stop-opacity="0" />
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="100" fill="url(#glow)" />
  <path d="M68 76c0-18 15-32 33-32h54c18 0 33 14 33 32v36c0 18-15 32-33 32H144l-14 16a8 8 0 0 1-12-1l-14-15H101c-18 0-33-14-33-32V76Z" fill="#111827" stroke="url(#g)" stroke-width="8" />
  <circle cx="98" cy="104" r="18" fill="#F8FAFC" />
  <circle cx="158" cy="96" r="16" fill="#F8FAFC" />
  <path d="M102 146c0-24 20-44 44-44s44 20 44 44v18H102v-18Z" fill="#F8FAFC" fill-opacity="0.16" />
  <ellipse cx="128" cy="126" rx="84" ry="86" fill="none" stroke="url(#g)" stroke-width="8" opacity="0.28" />
</svg>
`;

const splashScreen = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" role="img" aria-label="StrangerVerse splash screen">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090B17" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)" />
  <circle cx="640" cy="340" r="220" fill="rgba(56, 189, 248, 0.12)" />
  <circle cx="680" cy="280" r="180" fill="rgba(139, 92, 246, 0.1)" />
  <g transform="translate(520 210)">
    <path d="M84 44c0-18 14-32 32-32h40c18 0 32 14 32 32v30c0 18-14 32-32 32H164l-12 14a8 8 0 0 1-13-2l-8-12H112c-18 0-32-14-32-32V74Z" fill="#111827" stroke="url(#brand)" stroke-width="9" />
    <circle cx="104" cy="84" r="18" fill="#F8FAFC" />
    <circle cx="148" cy="78" r="16" fill="#F8FAFC" />
  </g>
  <text x="640" y="520" fill="#F8FAFC" font-family="Inter, system-ui, sans-serif" font-size="58" font-weight="700" text-anchor="middle">StrangerVerse</text>
  <text x="640" y="580" fill="#94A3B8" font-family="Inter, system-ui, sans-serif" font-size="26" text-anchor="middle">A World of Strangers</text>
</svg>
`;

createSvgFile('og-image.svg', ogImage);
createSvgFile('favicon.svg', favicon);
createSvgFile('apple-touch-icon.png', appleIcon);
createSvgFile('logo.svg', logoSvg);
createSvgFile('logo.png', logoSvg);
createSvgFile('logo-transparent.svg', logoTransparentSvg);
createSvgFile('logo-transparent.png', logoTransparentSvg);
createSvgFile('android-chrome-192x192.png', logoSvg);
createSvgFile('android-chrome-512x512.png', logoSvg);
createSvgFile('splash-screen.svg', splashScreen);

console.log('Public asset generation completed.');
