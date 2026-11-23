/**
 * spawn's calm look, as rules on every stylesheet of the package (spawn tests/tokens.test.ts "the guards",
 * tests/chat-virtual.test.ts, the focus-ring harness). A component that breaks one fails here.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')
const walk = (d: string): string[] => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p] })
const sheets = walk(SRC).filter(f => f.endsWith('.css')).map(f => ({ file: basename(f), text: readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') }))
type Rule = { file: string; sel: string; body: string; at: string | null }
function rules(): Rule[] {
  const out: Rule[] = []
  for (const s of sheets) {
    // one level of @media nesting is enough for these sheets
    const re = /(@media[^{]+)\{((?:[^{}]*\{[^}]*\})*)\s*\}|([^{}@]+)\{([^}]*)\}/g
    let m: RegExpExecArray | null
    while ((m = re.exec(s.text))) {
      if (m[1]) for (const r of m[2].matchAll(/([^{}]+)\{([^}]*)\}/g)) out.push({ file: s.file, sel: r[1].trim(), body: r[2], at: m[1].trim() })
      else out.push({ file: s.file, sel: m[3].trim(), body: m[4], at: null })
    }
  }
  return out
}
const values = (body: string, prop: string) => [...body.matchAll(new RegExp(`(?:^|;|\\s)${prop}\\s*:\\s*([^;]+)`, 'g'))].map(m => m[1].trim())

describe('the calm look, on every stylesheet', () => {
  it('there are stylesheets to check', () => {
    expect(sheets.length).toBeGreaterThan(0)
  })

  it('no px font-size; font-size only var(--t-*) or calc() of one', () => {
    for (const r of rules()) for (const v of values(r.body, 'font-size')) {
      expect(/^var\(--t-[\w-]+\)$/.test(v) || /^calc\(.*var\(--t-[\w-]+\).*\)$/.test(v) || v === 'inherit', `${r.file} ${r.sel}: font-size ${v}`).toBe(true)
    }
  })

  it('font-weight only 380/400/500/600 or var(--w-*)', () => {
    for (const r of rules()) for (const v of values(r.body, 'font-weight')) {
      expect(/^(380|400|500|600|inherit)$/.test(v) || /^var\(--w-[\w-]+\)$/.test(v), `${r.file} ${r.sel}: font-weight ${v}`).toBe(true)
    }
  })

  it('border-radius only var(--r-*), 0, 1px, 2px, 50 %; 999px only in switch.css and badge.css', () => {
    for (const r of rules()) for (const v of values(r.body, 'border-radius')) {
      for (const part of v.split(/\s+/)) {
        const ok = /^var\(--r-[\w-]+\)$/.test(part) || ['0', '1px', '2px', '50%', 'inherit'].includes(part) || (part === '999px' && ['switch.css', 'badge.css'].includes(r.file))
        expect(ok, `${r.file} ${r.sel}: border-radius ${v}`).toBe(true)
      }
    }
  })

  it('var(--accent) appears only in switch.css (the allow-list later plans extend: send, chosen row, picked cell)', () => {
    const ACCENT_OK = ['switch.css']
    for (const s of sheets) if (/var\(--accent(?:-hover)?\)/.test(s.text)) expect(ACCENT_OK, `${s.file} uses yellow`).toContain(s.file)
  })

  it('every transition / animation has a reduced-motion rule that turns it off', () => {
    const reduced = rules().filter(r => r.at?.includes('prefers-reduced-motion'))
    for (const r of rules()) {
      if (r.at?.includes('prefers-reduced-motion')) continue
      const moves = [...values(r.body, 'transition'), ...values(r.body, 'animation')].filter(v => v !== 'none')
      if (!moves.length) continue
      const off = reduced.some(x => x.file === r.file && x.sel.split(',').map(s => s.trim()).some(s => r.sel.split(',').map(t => t.trim()).includes(s)) && /(transition|animation)\s*:\s*none/.test(x.body))
      expect(off, `${r.file} ${r.sel} moves (${moves[0]}) with no reduced-motion rule`).toBe(true)
    }
  })

  it('the one focus ring: :focus-visible outline 2px solid var(--ink-2); no :focus outline rules; never yellow', () => {
    const rs = rules()
    const ring = rs.find(r => r.file === 'base.css' && r.sel.includes(':focus-visible'))
    expect(ring?.body).toMatch(/outline:\s*2px solid var\(--ink-2\)/)
    for (const r of rs) {
      if (/:focus(?!-visible|-within)/.test(r.sel)) expect(/outline\s*:/.test(r.body), `${r.file} ${r.sel}: a :focus outline`).toBe(false)
      if (r.sel.includes(':focus-visible')) expect(/--accent/.test(r.body), `${r.file} ${r.sel}: a yellow ring`).toBe(false)
    }
  })
})
