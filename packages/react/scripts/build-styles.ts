/** dist/styles.css: the tokens, then base, then every component's stylesheet (alphabetical by folder) */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src')
const tokens = readFileSync(createRequire(import.meta.url).resolve('@spawn-ui/tokens/tokens.css'), 'utf8')
const base = readFileSync(join(src, 'styles', 'base.css'), 'utf8')
const parts = readdirSync(src).filter(d => statSync(join(src, d)).isDirectory() && d !== 'styles').sort()
  .flatMap(d => readdirSync(join(src, d)).filter(f => f.endsWith('.css')).sort().map(f => `/* ${d}/${f} */\n${readFileSync(join(src, d, f), 'utf8')}`))
writeFileSync(join(root, 'dist', 'styles.css'), [tokens, base, ...parts].join('\n'))
