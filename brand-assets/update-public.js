const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'pilotstack-logo.svg');
const pub = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

async function run() {
  const svgBuf = fs.readFileSync(src);

  // favicon.ico (16, 32, 48)
  const icoSizes = [16, 32, 48];
  const icoParts = [];
  let offset = 6 + (icoSizes.length * 16);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(icoSizes.length, 4);
  icoParts.push(header);
  for (const s of icoSizes) {
    const png = await sharp(svgBuf).resize(s, s).png().toBuffer();
    const entry = Buffer.alloc(16);
    entry.writeUInt8(s < 256 ? s : 0, 0);   // Width
    entry.writeUInt8(s < 256 ? s : 0, 1);   // Height
    entry.writeUInt8(0, 2);                   // Color palette
    entry.writeUInt8(0, 3);                   // Reserved
    entry.writeUInt16LE(0, 4);               // Color planes (0 for ICO)
    entry.writeUInt16LE(32, 6);              // Bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    icoParts.push(entry);
    icoParts.push(png);
    offset += png.length;
  }
  fs.writeFileSync(path.join(pub, 'favicon.ico'), Buffer.concat(icoParts));
  console.log('favicon.ico');

  // favicon.svg
  fs.writeFileSync(path.join(pub, 'favicon.svg'), svgBuf);
  console.log('favicon.svg');

  // apple-touch-icon.png (180x180)
  await sharp(svgBuf).resize(180, 180).png().toFile(path.join(pub, 'apple-touch-icon.png'));
  console.log('apple-touch-icon.png');

  // logo.svg
  fs.writeFileSync(path.join(pub, 'logo.svg'), svgBuf);
  console.log('logo.svg');

  // logo-icon.svg
  fs.writeFileSync(path.join(pub, 'logo-icon.svg'), svgBuf);
  console.log('logo-icon.svg');

  // logo-vertical.svg
  fs.writeFileSync(path.join(pub, 'logo-vertical.svg'), svgBuf);
  console.log('logo-vertical.svg');

  // logo-horizontal.svg
  fs.writeFileSync(path.join(pub, 'logo-horizontal.svg'), svgBuf);
  console.log('logo-horizontal.svg');

  // logo-monochrome.svg (grayscale version)
  const monoSvg = svgBuf.toString()
    .replace(/#2563EB/g, '#374151')
    .replace(/#3B82F6/g, '#4B5563')
    .replace(/#4F46E5/g, '#374151')
    .replace(/#6366F1/g, '#4B5563')
    .replace(/#7C3AED/g, '#374151')
    .replace(/#8B5CF6/g, '#4B5563')
    .replace(/#06B6D4/g, '#6B7280');
  fs.writeFileSync(path.join(pub, 'logo-monochrome.svg'), monoSvg);
  console.log('logo-monochrome.svg');

  // og.svg with dark bg
  const b64 = svgBuf.toString('base64');
  const ogSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">' +
    '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
    '<stop offset="0%" stop-color="#0C0E14"/><stop offset="100%" stop-color="#111827"/>' +
    '</linearGradient></defs>' +
    '<rect width="1200" height="630" fill="url(#bg)"/>' +
    '<image x="460" y="65" width="280" height="280" href="data:image/svg+xml;base64:' + b64 + '"/>' +
    '<text x="600" y="430" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="64" font-weight="700" fill="white" letter-spacing="-1">PilotStack</text>' +
    '<text x="600" y="480" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="24" fill="#94A3B8">Navigate your software stack with confidence</text>' +
    '</svg>';
  fs.writeFileSync(path.join(pub, 'og.svg'), ogSvg);
  console.log('og.svg');

  // og.png
  await sharp(Buffer.from(ogSvg)).resize(1200, 630).png().toFile(path.join(pub, 'og.png'));
  console.log('og.png');

  // Also update the src/app/favicon.ico by copying
  fs.copyFileSync(path.join(pub, 'favicon.ico'), path.join(appDir, 'favicon.ico'));
  console.log('src/app/favicon.ico');

  // apple-touch-icon.svg (copy of main logo SVG)
  fs.writeFileSync(path.join(pub, 'apple-touch-icon.svg'), svgBuf);
  console.log('apple-touch-icon.svg');

  console.log('\nAll assets generated!');
}

run().catch(e => { console.error(e); process.exit(1); });
