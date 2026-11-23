// A screenshot of the docs site (dev aid): node scripts/shot.mjs <url> <out.png> [width] [height] [full]
import { homedir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
const PW = process.env.PLAYWRIGHT_CORE ?? join(homedir(), 'Documents', 'spawn-promo', 'video', 'node_modules', 'playwright-core')
const { chromium } = await import(pathToFileURL(join(PW, 'index.mjs')).href)
const [,, url, out, w = '1280', h = '900', full] = process.argv
const b = await chromium.launch({ channel: 'msedge' })
const p = await b.newPage({ viewport: { width: +w, height: +h } })
await p.goto(url, { waitUntil: 'networkidle' })
await p.screenshot({ path: out, fullPage: full === 'full' })
await b.close()
