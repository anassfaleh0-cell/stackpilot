const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const SVG_DIR = path.join(BASE, 'svg');
const PNG_DIR = path.join(BASE, 'png');
const ICO_DIR = path.join(BASE, 'ico');
const SOC_DIR = path.join(BASE, 'social');

const BRAND = {
  blue: '#2563EB',
  indigo: '#4F46E5',
  purple: '#7C3AED',
  cyan: '#06B6D4',
  dark: '#0F172A',
  white: '#FFFFFF',
};

function svgWrap(inner, w, h, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="50%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="ch" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="s1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
    <linearGradient id="s2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4F46E5"/><stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
    <linearGradient id="s3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
    <linearGradient id="glow" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
    </linearGradient>
  </defs>
  ${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ''}
  ${inner}
</svg>`;
}

function compassIcon(cx, cy, scale) {
  const s = scale;
  return `
    <g transform="translate(${cx},${cy}) scale(${s})">
      <rect x="-120" y="-90" width="240" height="18" rx="4" fill="url(#s1)"/>
      <rect x="-105" y="-62" width="210" height="18" rx="4" fill="url(#s2)"/>
      <rect x="-90" y="-34" width="180" height="18" rx="4" fill="url(#s3)"/>
      <circle cx="0" cy="-36" r="85" fill="none" stroke="url(#mg)" stroke-width="10"/>
      <circle cx="0" cy="-36" r="68" fill="none" stroke="url(#ch)" stroke-width="3"/>
      <line x1="0" y1="-115" x2="0" y2="40" stroke="url(#mg)" stroke-width="8" stroke-linecap="round"/>
      <line x1="-80" y1="-36" x2="80" y2="-36" stroke="url(#mg)" stroke-width="8" stroke-linecap="round"/>
      <polygon points="0,-120 -8,-100 0,-105 8,-100" fill="#2563EB"/>
      <polygon points="0,45 -8,25 0,30 8,25" fill="#7C3AED"/>
      <polygon points="-85,-36 -65,-44 -70,-36 -65,-28" fill="#2563EB"/>
      <polygon points="85,-36 65,-44 70,-36 65,-28" fill="#7C3AED"/>
      <circle cx="0" cy="-36" r="6" fill="url(#ch)"/>
      <circle cx="0" cy="-36" r="3" fill="white"/>
      <path d="M-5,-115 L0,-130 L5,-115" fill="none" stroke="#06B6D4" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="0" cy="-68" r="3" fill="#06B6D4"/>
      <circle cx="0" cy="-4" r="3" fill="#06B6D4"/>
      <circle cx="-52" cy="-36" r="3" fill="#06B6D4"/>
      <circle cx="52" cy="-36" r="3" fill="#06B6D4"/>
    </g>`;
}

function darkCompassIcon(cx, cy, scale) {
  const s = scale;
  return `
    <g transform="translate(${cx},${cy}) scale(${s})">
      <rect x="-120" y="-90" width="240" height="18" rx="4" fill="url(#s1d)"/>
      <rect x="-105" y="-62" width="210" height="18" rx="4" fill="url(#s2d)"/>
      <rect x="-90" y="-34" width="180" height="18" rx="4" fill="url(#s3d)"/>
      <circle cx="0" cy="-36" r="85" fill="none" stroke="url(#mg)" stroke-width="10"/>
      <circle cx="0" cy="-36" r="68" fill="none" stroke="url(#chd)" stroke-width="3"/>
      <line x1="0" y1="-115" x2="0" y2="40" stroke="url(#mg)" stroke-width="8" stroke-linecap="round"/>
      <line x1="-80" y1="-36" x2="80" y2="-36" stroke="url(#mg)" stroke-width="8" stroke-linecap="round"/>
      <polygon points="0,-120 -8,-100 0,-105 8,-100" fill="#60A5FA"/>
      <polygon points="0,45 -8,25 0,30 8,25" fill="#A78BFA"/>
      <polygon points="-85,-36 -65,-44 -70,-36 -65,-28" fill="#60A5FA"/>
      <polygon points="85,-36 65,-44 70,-36 65,-28" fill="#A78BFA"/>
      <circle cx="0" cy="-36" r="6" fill="url(#chd)"/>
      <circle cx="0" cy="-36" r="3" fill="#0F172A"/>
      <path d="M-5,-115 L0,-130 L5,-115" fill="none" stroke="#22D3EE" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="0" cy="-68" r="3" fill="#22D3EE"/>
      <circle cx="0" cy="-4" r="3" fill="#22D3EE"/>
      <circle cx="-52" cy="-36" r="3" fill="#22D3EE"/>
      <circle cx="52" cy="-36" r="3" fill="#22D3EE"/>
    </g>`;
}

function monoCompassIcon(cx, cy, scale) {
  const s = scale;
  return `
    <g transform="translate(${cx},${cy}) scale(${s})">
      <rect x="-120" y="-90" width="240" height="18" rx="4" fill="#1E293B"/>
      <rect x="-105" y="-62" width="210" height="18" rx="4" fill="#334155"/>
      <rect x="-90" y="-34" width="180" height="18" rx="4" fill="#475569"/>
      <circle cx="0" cy="-36" r="85" fill="none" stroke="#1E293B" stroke-width="10"/>
      <circle cx="0" cy="-36" r="68" fill="none" stroke="#94A3B8" stroke-width="3"/>
      <line x1="0" y1="-115" x2="0" y2="40" stroke="#1E293B" stroke-width="8" stroke-linecap="round"/>
      <line x1="-80" y1="-36" x2="80" y2="-36" stroke="#1E293B" stroke-width="8" stroke-linecap="round"/>
      <polygon points="0,-120 -8,-100 0,-105 8,-100" fill="#1E293B"/>
      <polygon points="0,45 -8,25 0,30 8,25" fill="#475569"/>
      <polygon points="-85,-36 -65,-44 -70,-36 -65,-28" fill="#1E293B"/>
      <polygon points="85,-36 65,-44 70,-36 65,-28" fill="#475569"/>
      <circle cx="0" cy="-36" r="6" fill="#64748B"/>
      <circle cx="0" cy="-36" r="3" fill="white"/>
      <path d="M-5,-115 L0,-130 L5,-115" fill="none" stroke="#64748B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="0" cy="-68" r="3" fill="#64748B"/>
      <circle cx="0" cy="-4" r="3" fill="#64748B"/>
      <circle cx="-52" cy="-36" r="3" fill="#64748B"/>
      <circle cx="52" cy="-36" r="3" fill="#64748B"/>
    </g>`;
}

const darkDefs = `
    <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="50%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="ch" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="chd" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="s1d" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#60A5FA"/>
    </linearGradient>
    <linearGradient id="s2d" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366F1"/><stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
    <linearGradient id="s3d" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#8B5CF6"/><stop offset="100%" stop-color="#A78BFA"/>
    </linearGradient>`;

function darkDefsBlock() { return darkDefs; }

const TEXT_BLOCK = (text, x, y, size, fill, anchor) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" font-family="'Inter','Segoe UI',system-ui,-apple-system,sans-serif" font-size="${size}" font-weight="700" fill="${fill}" letter-spacing="-2">${text}</text>`;

async function svgToPng(svgString, outPath, w, h) {
  const buf = Buffer.from(svgString);
  await sharp(buf).resize(w, h).png({ quality: 100, compressionLevel: 9 }).toFile(outPath);
  console.log(`  ✓ ${path.relative(BASE, outPath)} (${w}x${h})`);
}

async function svgToIco(svgString, outPath, sizes) {
  const buf = Buffer.from(svgString);
  const resized = [];
  for (const s of sizes) {
    const png = await sharp(buf).resize(s, s).png().toBuffer();
    resized.push(png);
  }
  // ICO format: header + directory entries + PNG data
  const numImages = resized.length;
  // ICO header: 6 bytes
  // Each dir entry: 16 bytes
  const headerSize = 6 + (numImages * 16);
  let offset = headerSize;

  const icoParts = [];
  // Header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);       // Reserved
  header.writeUInt16LE(1, 2);       // Type: ICO
  header.writeUInt16LE(numImages, 4); // Count
  icoParts.push(header);

  const entries = [];
  const pngBuffers = [];
  for (let i = 0; i < numImages; i++) {
    const s = sizes[i];
    const pngData = resized[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(s < 256 ? s : 0, 0);   // Width
    entry.writeUInt8(s < 256 ? s : 0, 1);   // Height
    entry.writeUInt8(0, 2);                   // Color palette
    entry.writeUInt8(0, 3);                   // Reserved
    entry.writeUInt16LE(1, 4);               // Color planes
    entry.writeUInt16LE(32, 6);              // Bits per pixel
    entry.writeUInt32LE(pngData.length, 8);  // Data size
    entry.writeUInt32LE(offset, 12);         // Data offset
    entries.push(entry);
    pngBuffers.push(pngData);
    offset += pngData.length;
  }

  for (const e of entries) icoParts.push(e);
  for (const p of pngBuffers) icoParts.push(p);

  fs.writeFileSync(outPath, Buffer.concat(icoParts));
  console.log(`  ✓ ${path.relative(BASE, outPath)} (ICO ${sizes.join('x')})`);
}

async function createSocialCard(outPath, w, h, opts) {
  const { bg, title, subtitle, subtitleFill, compassScale, compassX, compassY, titleY, subY } = opts;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="50%" stop-color="#4F46E5"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="ch" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="s1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563EB"/><stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
    <linearGradient id="s2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4F46E5"/><stop offset="100%" stop-color="#6366F1"/>
    </linearGradient>
    <linearGradient id="s3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
    <linearGradient id="glow" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spot" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect width="${w}" height="${h * 0.4}" y="0" fill="url(#glow)"/>
  <ellipse cx="${w * 0.7}" cy="${h * 0.5}" rx="${w * 0.35}" ry="${h * 0.6}" fill="url(#spot)"/>
  <ellipse cx="${w * 0.2}" cy="${h * 0.7}" rx="${w * 0.25}" ry="${h * 0.4}" fill="url(#spot)" opacity="0.5"/>
  ${compassIcon(compassX, compassY, compassScale)}
  ${TEXT_BLOCK(title, w / 2, titleY, Math.round(w * 0.065), '#FFFFFF', 'middle')}
  ${TEXT_BLOCK(subtitle, w / 2, subY, Math.round(w * 0.028), subtitleFill || '#94A3B8', 'middle')}
</svg>`;
  const buf = Buffer.from(svg);
  await sharp(buf).resize(w, h).png({ quality: 95, compressionLevel: 9 }).toFile(outPath);
  console.log(`  ✓ ${path.relative(BASE, outPath)} (${w}x${h})`);
}

async function main() {
  console.log('\n🔧 Generating PilotStack brand assets...\n');

  // ─── ICONS ───
  console.log('📦 Icons & Favicons:');

  const faviconSvg = fs.readFileSync(path.join(SVG_DIR, 'favicon.svg'), 'utf8');
  await svgToIco(faviconSvg, path.join(ICO_DIR, 'favicon.ico'), [16, 32, 48, 64, 128, 256]);

  const lightSvg = fs.readFileSync(path.join(SVG_DIR, 'logo-light.svg'), 'utf8');
  await svgToPng(lightSvg, path.join(PNG_DIR, 'apple-touch-icon.png'), 180, 180);
  await svgToPng(lightSvg, path.join(PNG_DIR, 'icon-192.png'), 192, 192);
  await svgToPng(lightSvg, path.join(PNG_DIR, 'icon-512.png'), 512, 512);

  // ─── SOCIAL: Reddit Avatar (256x256) ───
  console.log('\n📱 Social Media Assets:');

  const redditAvatarSvg = svgWrap(
    `<rect width="256" height="256" fill="#0F172A" rx="32"/>
     ${compassIcon(128, 136, 0.55)}`,
    256, 256, null
  );
  await svgToPng(redditAvatarSvg, path.join(SOC_DIR, 'reddit-avatar.png'), 256, 256);

  // ─── SOCIAL: Reddit Banner (1920x384) ───
  const redditBannerSvg = svgWrap(
    `<rect width="1920" height="384" fill="#0F172A"/>
     <rect width="1920" height="384" fill="url(#glow)" opacity="0.5"/>
     <ellipse cx="960" cy="192" rx="600" ry="250" fill="url(#ch)" opacity="0.06"/>
     ${compassIcon(320, 210, 0.7)}
     ${TEXT_BLOCK('PilotStack', 680, 210, 72, '#FFFFFF', 'left')}
     ${TEXT_BLOCK('Navigate Your Software Ecosystem', 680, 258, 22, '#94A3B8', 'left')}`,
    1920, 384, null
  );
  await svgToPng(redditBannerSvg, path.join(SOC_DIR, 'reddit-banner.png'), 1920, 384);

  // ─── SOCIAL: Twitter Header (1500x500) ───
  await createSocialCard(path.join(SOC_DIR, 'twitter-header.png'), 1500, 500, {
    bg: '#0F172A',
    title: 'PilotStack',
    subtitle: 'Navigate Your Software Ecosystem',
    subtitleFill: '#94A3B8',
    compassScale: 0.75,
    compassX: 300,
    compassY: 270,
    titleY: 230,
    subY: 290,
  });

  // ─── SOCIAL: LinkedIn Banner (1584x396) ───
  await createSocialCard(path.join(SOC_DIR, 'linkedin-banner.png'), 1584, 396, {
    bg: '#0F172A',
    title: 'PilotStack',
    subtitle: 'Navigate Your Software Ecosystem',
    subtitleFill: '#94A3B8',
    compassScale: 0.65,
    compassX: 280,
    compassY: 210,
    titleY: 195,
    subY: 245,
  });

  // ─── SOCIAL: GitHub Social Preview (1280x640) ───
  const ghSvg = svgWrap(
    `<rect width="1280" height="640" fill="#0F172A"/>
     <rect width="1280" height="640" fill="url(#glow)" opacity="0.4"/>
     <ellipse cx="800" cy="320" rx="450" ry="300" fill="url(#ch)" opacity="0.05"/>
     ${compassIcon(280, 330, 0.9)}
     ${TEXT_BLOCK('PilotStack', 700, 280, 80, '#FFFFFF', 'left')}
     ${TEXT_BLOCK('Navigate Your Software Ecosystem', 700, 340, 28, '#94A3B8', 'left')}`,
    1280, 640, null
  );
  await svgToPng(ghSvg, path.join(SOC_DIR, 'github-social-preview.png'), 1280, 640);

  // ─── Open Graph (1200x630) ───
  console.log('\n🌐 Meta & OG Images:');

  const ogSvg = svgWrap(
    `<rect width="1200" height="630" fill="#0F172A"/>
     <rect width="1200" height="630" fill="url(#glow)" opacity="0.3"/>
     <ellipse cx="700" cy="315" rx="400" ry="280" fill="url(#ch)" opacity="0.05"/>
     <ellipse cx="200" cy="500" rx="300" ry="200" fill="url(#ch)" opacity="0.04"/>
     ${compassIcon(260, 330, 0.85)}
     ${TEXT_BLOCK('PilotStack', 650, 280, 76, '#FFFFFF', 'left')}
     ${TEXT_BLOCK('Navigate Your Software Ecosystem', 650, 340, 26, '#94A3B8', 'left')}
     ${TEXT_BLOCK('pilotstack.dev', 650, 385, 20, '#06B6D4', 'left')}`,
    1200, 630, null
  );
  await svgToPng(ogSvg, path.join(PNG_DIR, 'og-image.png'), 1200, 630);

  // ─── Twitter Card (1200x600) ───
  const tcSvg = svgWrap(
    `<rect width="1200" height="600" fill="#0F172A"/>
     <rect width="1200" height="600" fill="url(#glow)" opacity="0.3"/>
     <ellipse cx="650" cy="300" rx="380" ry="260" fill="url(#ch)" opacity="0.05"/>
     ${compassIcon(250, 310, 0.8)}
     ${TEXT_BLOCK('PilotStack', 620, 270, 72, '#FFFFFF', 'left')}
     ${TEXT_BLOCK('Navigate Your Software Ecosystem', 620, 325, 24, '#94A3B8', 'left')}`,
    1200, 600, null
  );
  await svgToPng(tcSvg, path.join(PNG_DIR, 'twitter-card.png'), 1200, 600);

  console.log('\n✅ All brand assets generated successfully!\n');

  // Print manifest
  console.log('📋 Asset Manifest:');
  console.log('─────────────────────────────────────────');
  const files = [
    ['svg/favicon.svg', 'Favicon (SVG)'],
    ['ico/favicon.ico', 'Favicon (ICO, multi-size)'],
    ['svg/logo-light.svg', 'Logo Light (SVG)'],
    ['svg/logo-dark.svg', 'Logo Dark (SVG)'],
    ['svg/logo-monochrome.svg', 'Logo Monochrome (SVG)'],
    ['svg/logo-horizontal.svg', 'Logo Horizontal (SVG)'],
    ['svg/logo-stacked.svg', 'Logo Stacked (SVG)'],
    ['png/apple-touch-icon.png', 'Apple Touch Icon (180x180)'],
    ['png/icon-192.png', 'PWA Icon (192x192)'],
    ['png/icon-512.png', 'PWA Icon (512x512)'],
    ['social/reddit-avatar.png', 'Reddit Avatar (256x256)'],
    ['social/reddit-banner.png', 'Reddit Banner (1920x384)'],
    ['social/twitter-header.png', 'Twitter Header (1500x500)'],
    ['social/linkedin-banner.png', 'LinkedIn Banner (1584x396)'],
    ['social/github-social-preview.png', 'GitHub Social Preview (1280x640)'],
    ['png/og-image.png', 'Open Graph (1200x630)'],
    ['png/twitter-card.png', 'Twitter Card (1200x600)'],
  ];
  for (const [file, desc] of files) {
    const full = path.join(BASE, file);
    if (fs.existsSync(full)) {
      const stats = fs.statSync(full);
      const kb = (stats.size / 1024).toFixed(1);
      console.log(`  ${desc.padEnd(40)} ${file.padEnd(38)} ${kb} KB`);
    }
  }
  console.log('─────────────────────────────────────────');
  console.log(`  Brand colors: Blue #2563EB | Indigo #4F46E5 | Purple #7C3AED | Cyan #06B6D4`);
  console.log(`  Total files: ${files.length}\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
