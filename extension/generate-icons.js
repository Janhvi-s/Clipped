// Generates icons/icon16.png, icon48.png, icon128.png
// Run once: node generate-icons.js
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

function u32be(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n >>> 0, 0);
  return b;
}

function crc32(buf) {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const byte of buf) crc = ((crc >>> 8) ^ table[(crc ^ byte) & 0xff]) >>> 0;
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const crcInput = Buffer.concat([t, d]);
  return Buffer.concat([u32be(d.length), t, d, u32be(crc32(crcInput))]);
}

function makePNG(size, [r, g, b, a = 255]) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR: width, height, bit depth 8, color type 6 (RGBA), compression 0, filter 0, interlace 0
  const ihdr = Buffer.concat([
    u32be(size), u32be(size),
    Buffer.from([8, 6, 0, 0, 0]),
  ]);

  // Raw image: filter byte 0 + RGBA pixels per row
  const row = Buffer.alloc(1 + size * 4);
  row[0] = 0; // filter None
  for (let x = 0; x < size; x++) {
    row[1 + x * 4]     = r;
    row[2 + x * 4]     = g;
    row[3 + x * 4]     = b;
    row[4 + x * 4]     = a;
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  const compressed = zlib.deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, 'icons');
fs.mkdirSync(outDir, { recursive: true });

const INDIGO = [99, 102, 241, 255]; // #6366f1

for (const size of [16, 48, 128]) {
  const png = makePNG(size, INDIGO);
  const file = path.join(outDir, `icon${size}.png`);
  fs.writeFileSync(file, png);
  console.log(`Created ${file} (${size}x${size})`);
}
