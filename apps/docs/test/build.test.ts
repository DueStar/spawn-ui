/** The built site: both languages, the four groups, a page per component (run after `npm run build`) */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const html = (p: string) => readFileSync(join(dist, p), 'utf8')

describe('the docs site', () => {
  it('has a Korean and an English home', () => {
    expect(existsSync(join(dist, 'index.html'))).toBe(true)
    expect(existsSync(join(dist, 'en', 'index.html'))).toBe(true)
  })
  it('its sidebar has the four groups, in each language', () => {
    const ko = html('getting-started/introduction/index.html')
    for (const g of ['시작하기', '토큰', '컴포넌트', '릴리스']) expect(ko, g).toContain(g)
    const en = html('en/getting-started/introduction/index.html')
    for (const g of ['Getting Started', 'Tokens', 'Components', 'Releases']) expect(en, g).toContain(g)
  })
  it('every exported component has a Korean and an English page', () => {
    const index = readFileSync(join(root, '..', '..', 'packages', 'react', 'src', 'index.ts'), 'utf8')
    const names = [...index.matchAll(/export \{ ([A-Z]\w+)/g)].map(m => m[1]).filter(n => n !== 'VisuallyHidden' && n !== 'PortalProvider' && n !== 'TabPanel')
    const slug = (n: string) => n.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    const pages = (lang: string) => {
      const base = join(dist, lang, 'components')
      return existsSync(base) ? readdirSync(base, { recursive: true }).map(String).filter(p => p.endsWith('index.html')).map(p => p.split(/[\\/]/).slice(-2, -1)[0]) : []
    }
    for (const n of names) {
      expect(pages(''), `ko page for ${n}`).toContain(slug(n))
      expect(pages('en'), `en page for ${n}`).toContain(slug(n))
    }
  })
  it('the releases pages show each package\'s current version', () => {
    for (const pkg of ['tokens', 'react']) {
      const v = JSON.parse(readFileSync(join(root, '..', '..', 'packages', pkg, 'package.json'), 'utf8')).version
      expect(html(`releases/${pkg}/index.html`), pkg).toContain(v)
      expect(html(`en/releases/${pkg}/index.html`), pkg).toContain(v)
    }
  })
  it('the Containers group is in the sidebar, and the scrollbar has a page, in each language', () => {
    expect(html('getting-started/introduction/index.html')).toContain('담는 것')
    expect(html('en/getting-started/introduction/index.html')).toContain('Containers')
    expect(existsSync(join(dist, 'components', 'foundations', 'scrollbar', 'index.html'))).toBe(true)
    expect(existsSync(join(dist, 'en', 'components', 'foundations', 'scrollbar', 'index.html'))).toBe(true)
  })
})
