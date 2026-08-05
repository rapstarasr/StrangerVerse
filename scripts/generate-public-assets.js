/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.resolve(__dirname, '../public');

const writeFile = (filePath, content) => {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created ${path.relative(publicDir, filePath)}`);
};

const createSvgFile = (name, content) => writeFile(path.join(publicDir, name), content);

const createPngFromSvg = async (name, svg, size) => {
  await sharp(Buffer.from(svg))
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(publicDir, name));
  console.log(`Created ${name}`);
};

const createIcoFromPngs = async (name, pngBuffers) => {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;

  pngBuffers.forEach((item, index) => {
    const entry = dirEntries.slice(index * 16, index * 16 + 16);
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 0);
    entry.writeUInt8(item.size === 256 ? 0 : item.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += item.buffer.length;
  });

  const icoBuffer = Buffer.concat([header, dirEntries, ...pngBuffers.map((item) => item.buffer)]);
  fs.writeFileSync(path.join(publicDir, name), icoBuffer);
  console.log(`Created ${name}`);
};

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
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#20345B" />
      <stop offset="100%" stop-color="#18223F" />
    </linearGradient>
    <linearGradient id="orbit" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#18223F" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#bg)" />
  <circle cx="32" cy="32" r="24" fill="url(#glow)" />
  <path d="M22 25a9 9 0 0 1 9-9h12a9 9 0 0 1 9 9v8a9 9 0 0 1-9 9h-6l-5 5v-5h-4a9 9 0 0 1-9-9v-8Z" fill="#8B5CF6" />
  <circle cx="25" cy="25" r="4.5" fill="#F8FAFC" />
  <circle cx="39" cy="23" r="3.5" fill="#F8FAFC" />
  <path d="M22 34c4-4 10-6 15-6s11 2 15 6" fill="none" stroke="#22D3EE" stroke-width="2.2" stroke-linecap="round" opacity="0.75" />
  <path d="M12 25c10-11 25-12 36-3" fill="none" stroke="url(#orbit)" stroke-width="4" stroke-linecap="round" />
  <path d="M52 45c-10 11-25 12-36 3" fill="none" stroke="url(#orbit)" stroke-width="4" stroke-linecap="round" />
</svg>
`;

const appleIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-label="StrangerVerse icon">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#20345B" />
      <stop offset="100%" stop-color="#18223F" />
    </linearGradient>
    <linearGradient id="orbit" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
  </defs>
  <rect width="180" height="180" rx="36" fill="url(#bg)" />
  <circle cx="90" cy="90" r="72" fill="none" stroke="url(#orbit)" stroke-width="18" opacity="0.24" />
  <path d="M50 58a15 15 0 0 1 15-15h20a15 15 0 0 1 15 15v14a15 15 0 0 1-15 15h-10l-8 9v-9h-6a15 15 0 0 1-15-15v-14Z" fill="#8B5CF6" />
  <circle cx="65" cy="68" r="8" fill="#F8FAFC" />
  <circle cx="105" cy="66" r="6.5" fill="#F8FAFC" />
  <path d="M58 100c8-8 18-12 28-12s20 4 28 12" fill="none" stroke="#22D3EE" stroke-width="4" stroke-linecap="round" opacity="0.8" />
</svg>
`;

const logoSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="StrangerVerse logo">
  <defs>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="45%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="85%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#090B17" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="grid" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#F8FAFC" stop-opacity="0.04" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="48" fill="#090B17" />
  <circle cx="128" cy="128" r="96" fill="url(#glow)" />
  <path d="M62 92c0-18 15-32 32-32h68c17 0 32 14 32 32v44c0 18-15 32-32 32h-18l-14 16a8 8 0 0 1-12 0l-14-16H94c-17 0-32-14-32-32V92Z" fill="#111827" stroke="url(#brand)" stroke-width="8" />
  <circle cx="84" cy="78" r="14" fill="#F8FAFC" />
  <circle cx="166" cy="74" r="12" fill="#F8FAFC" />
  <path d="M98 110c0-8 6.5-14.5 14.5-14.5S127 102 127 110v8H98v-8Z" fill="#F8FAFC" />
  <path d="M150 106c0-6.5 5.5-12 12-12s12 5.5 12 12v6h-24v-6Z" fill="#F8FAFC" />
  <path d="M82 124c18-20 46-32 76-32s58 12 76 32" fill="none" stroke="url(#grid)" stroke-width="4" opacity="0.55" />
  <circle cx="128" cy="128" r="68" fill="none" stroke="url(#grid)" stroke-width="2" opacity="0.18" />
  <path d="M56 130c30-38 70-56 108-56 32 0 62 12 90 36" fill="none" stroke="#22D3EE" stroke-width="4" opacity="0.18" stroke-linecap="round" />
  <path d="M48 168c22-36 56-56 92-56 34 0 66 18 88 48" fill="none" stroke="#8B5CF6" stroke-width="4" opacity="0.14" stroke-linecap="round" />
  <ellipse cx="128" cy="112" rx="88" ry="90" fill="none" stroke="url(#brand)" stroke-width="6" opacity="0.18" />
</svg>
`;

const logoTransparentSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="StrangerVerse transparent logo">
  <defs>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="45%" stop-color="#8B5CF6" />
      <stop offset="100%" stop-color="#22D3EE" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="85%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.16" />
      <stop offset="100%" stop-color="#090B17" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="grid" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#F8FAFC" stop-opacity="0.04" />
    </linearGradient>
  </defs>
  <circle cx="128" cy="128" r="96" fill="url(#glow)" />
  <path d="M62 92c0-18 15-32 32-32h68c17 0 32 14 32 32v44c0 18-15 32-32 32h-18l-14 16a8 8 0 0 1-12 0l-14-16H94c-17 0-32-14-32-32V92Z" fill="#111827" stroke="url(#brand)" stroke-width="8" />
  <circle cx="84" cy="78" r="14" fill="#F8FAFC" />
  <circle cx="166" cy="74" r="12" fill="#F8FAFC" />
  <path d="M98 110c0-8 6.5-14.5 14.5-14.5S127 102 127 110v8H98v-8Z" fill="#F8FAFC" />
  <path d="M150 106c0-6.5 5.5-12 12-12s12 5.5 12 12v6h-24v-6Z" fill="#F8FAFC" />
  <path d="M82 124c18-20 46-32 76-32s58 12 76 32" fill="none" stroke="url(#grid)" stroke-width="4" opacity="0.55" />
  <circle cx="128" cy="128" r="68" fill="none" stroke="url(#grid)" stroke-width="2" opacity="0.18" />
  <path d="M56 130c30-38 70-56 108-56 32 0 62 12 90 36" fill="none" stroke="#22D3EE" stroke-width="4" opacity="0.18" stroke-linecap="round" />
  <path d="M48 168c22-36 56-56 92-56 34 0 66 18 88 48" fill="none" stroke="#8B5CF6" stroke-width="4" opacity="0.14" stroke-linecap="round" />
  <ellipse cx="128" cy="112" rx="88" ry="90" fill="none" stroke="url(#brand)" stroke-width="6" opacity="0.18" />
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
  <circle cx="680" cy="280" r="150" fill="rgba(139, 92, 246, 0.1)" />
  <g transform="translate(520 200)">
    <path d="M84 44c0-18 14-32 32-32h40c18 0 32 14 32 32v30c0 18-14 32-32 32H164l-12 14a8 8 0 0 1-13-2l-8-12H112c-18 0-32-14-32-32V74Z" fill="#111827" stroke="url(#brand)" stroke-width="9" />
    <circle cx="104" cy="84" r="18" fill="#F8FAFC" />
    <circle cx="148" cy="78" r="16" fill="#F8FAFC" />
    <path d="M96 110c8-8 18-12 28-12s20 4 28 12" fill="none" stroke="#22D3EE" stroke-width="4" stroke-linecap="round" opacity="0.8" />
  </g>
  <text x="640" y="520" fill="#F8FAFC" font-family="Inter, system-ui, sans-serif" font-size="58" font-weight="700" text-anchor="middle" letter-spacing="0.04em">StrangerVerse</text>
  <text x="640" y="580" fill="#94A3B8" font-family="Inter, system-ui, sans-serif" font-size="26" text-anchor="middle" letter-spacing="0.12em">A World of Strangers</text>
</svg>
`;

const resizePng = async (svg, size) =>
  sharp(Buffer.from(svg))
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

const run = async () => {
  createSvgFile('og-image.svg', ogImage);
  createSvgFile('favicon.svg', favicon);
  createSvgFile('apple-touch-icon.png', appleIcon);
  createSvgFile('logo.svg', logoSvg);
  createSvgFile('logo-transparent.svg', logoTransparentSvg);
  createSvgFile('splash-screen.svg', splashScreen);

  const faviconSizes = [16, 32, 48];
  const faviconBuffers = [];

  for (const size of faviconSizes) {
    const name = `favicon-${size}.png`;
    const buffer = await resizePng(favicon, size);
    fs.writeFileSync(path.join(publicDir, name), buffer);
    console.log(`Created ${name}`);
    faviconBuffers.push({ size, buffer });
  }

  await createIcoFromPngs('favicon.ico', faviconBuffers);
  await sharp(faviconBuffers[1].buffer).resize(192, 192).png().toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  await sharp(faviconBuffers[2].buffer).resize(512, 512).png().toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  await sharp(Buffer.from(appleIcon)).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Public asset generation completed.');
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
