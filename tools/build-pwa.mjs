/**
 * PWA assets generator — creates icon PNGs, an .ico, manifest.webmanifest and
 * sw.js into a frontend's public/ folder using only Node built-ins.
 *
 * Usage:
 *   node tools/build-pwa.mjs <frontendPublicDir> <appName> <shortName> <themeColor> <backgroundColor> [icoOut]
 */
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

const crcTable = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crcBuf])
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const stride = 1 + width * 4
  const raw = Buffer.alloc(height * stride)
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4)
  }
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// SA flag stripe (horizontal, matching the site's navbar stripe)
const BANDS = [
  [0.0, 0.13, [0, 0, 0]],
  [0.13, 0.26, [255, 184, 28]],
  [0.26, 0.39, [0, 119, 73]],
  [0.39, 0.47, [255, 255, 255]],
  [0.47, 0.74, [224, 60, 49]],
  [0.74, 0.86, [255, 255, 255]],
  [0.86, 1.0, [0, 20, 137]]
]

function drawIcon(size, maskable = false) {
  const S = size
  const px = Buffer.alloc(S * S * 4)
  const radius = S * 0.2
  const stripeY0 = Math.round(S * 0.5)
  const stripeY1 = Math.round(S * 0.78)
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4
      let alpha = 255
      if (!maskable) {
        const r = radius
        let cxr = x, cyr = y
        if (x < r && y < r) { cxr = r; cyr = r }
        else if (x < r && y >= S - r) { cxr = r; cyr = S - 1 - r }
        else if (x >= S - r && y < r) { cxr = S - 1 - r; cyr = r }
        else if (x >= S - r && y >= S - r) { cxr = S - 1 - r; cyr = S - 1 - r }
        if (Math.hypot(x - cxr, y - cyr) > r) alpha = 0
      }
      if (alpha === 0) {
        px[i] = px[i + 1] = px[i + 2] = px[i + 3] = 0
        continue
      }
      const t = y / S
      let cr = Math.round(26 + (0 - 26) * t)
      let cg = Math.round(47 + (10 - 47) * t)
      let cb = Math.round(169 + (82 - 169) * t)
      if (y >= stripeY0 && y < stripeY1) {
        const fx = x / S
        for (const [a, b, color] of BANDS) {
          if (fx >= a && fx < b) { cr = color[0]; cg = color[1]; cb = color[2]; break }
        }
      }
      px[i] = cr; px[i + 1] = cg; px[i + 2] = cb; px[i + 3] = alpha
    }
  }
  return encodePNG(S, S, px)
}

function encodeICO(pngs) {
  const count = pngs.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)
  let offset = 6 + 16 * count
  const entries = []
  const images = []
  for (const { size, png } of pngs) {
    const entry = Buffer.alloc(16)
    entry[0] = size >= 256 ? 0 : size
    entry[1] = size >= 256 ? 0 : size
    entry[2] = 0
    entry[3] = 0
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    images.push(png)
    offset += png.length
  }
  return Buffer.concat([header, ...entries, ...images])
}

const [publicDir, appName, shortName, themeColor, backgroundColor, icoOut] = process.argv.slice(2)
if (!publicDir) {
  console.error('Usage: node tools/build-pwa.mjs <publicDir> <appName> <shortName> <theme> <bg> [icoOut]')
  process.exit(1)
}

const iconsDir = path.join(publicDir, 'icons')
fs.mkdirSync(iconsDir, { recursive: true })

const icon512 = drawIcon(512, false)
const icon192 = drawIcon(192, false)
const icon180 = drawIcon(180, false)
const maskable512 = drawIcon(512, true)

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192)
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512)
fs.writeFileSync(path.join(iconsDir, 'maskable-512.png'), maskable512)
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), icon180)

if (icoOut) {
  fs.mkdirSync(path.dirname(icoOut), { recursive: true })
  const ico = encodeICO([
    { size: 16, png: drawIcon(16, false) },
    { size: 32, png: drawIcon(32, false) },
    { size: 48, png: drawIcon(48, false) },
    { size: 256, png: drawIcon(256, false) }
  ])
  fs.writeFileSync(icoOut, ico)
}

const manifest = {
  name: appName,
  short_name: shortName,
  description: 'South African university application platform — apply, subscribe and pay online.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'any',
  theme_color: themeColor,
  background_color: backgroundColor,
  icons: [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ]
}
fs.writeFileSync(path.join(publicDir, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2))

const sw = `/* ApplyDirect SA service worker — network-first with offline cache fallback */
const CACHE = 'uniapply-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE)
      try {
        const response = await fetch(request)
        if (response && response.ok) cache.put(request, response.clone())
        return response
      } catch (err) {
        const cached = await cache.match(request, { ignoreSearch: true })
        if (cached) return cached
        throw err
      }
    })()
  )
})
`
fs.writeFileSync(path.join(publicDir, 'sw.js'), sw)

console.log('PWA assets written to', publicDir)
console.log('  - icons/ (192, 512, maskable-512, apple-touch-icon)')
console.log('  - manifest.webmanifest')
console.log('  - sw.js')
if (icoOut) console.log('  -', icoOut)