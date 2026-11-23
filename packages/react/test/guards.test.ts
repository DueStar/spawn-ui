/**
 * spawn's calm look, as rules on every stylesheet of the package (spawn tests/tokens.test.ts "the guards",
 * tests/chat-virtual.test.ts, the focus-ring harness). Parsed with postcss: shorthands, longhands and rules nested in
 * any at-rule are all seen. A component that breaks one fails here.
 */
import postcss, { type Declaration, type Rule } from 'postcss'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')
const walk = (d: string): string[] => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p] })

type Decl = { file: string; sel: string; prop: string; value: string; reduced: boolean }
/** Every declaration of every stylesheet with its rule's selector and whether it sits under reduced motion */
export function declsOf(files: { file: string; text: string }[]): Decl[] {
  const out: Decl[] = []
  for (const f of files) {
    postcss.parse(f.text).walkDecls((d: Declaration) => {
      const rule = d.parent as Rule
      let reduced = false
      for (let p = d.parent?.parent; p; p = p.parent) if (p.type === 'atrule' && /prefers-reduced-motion/.test((p as postcss.AtRule).params)) reduced = true
      out.push({ file: f.file, sel: rule.selector ?? '', prop: d.prop.toLowerCase(), value: d.value.trim(), reduced })
    })
  }
  return out
}
const sheets = walk(SRC).filter(f => f.endsWith('.css')).map(f => ({ file: basename(f), text: readFileSync(f, 'utf8') }))
const decls = () => declsOf(sheets)
/** A selector list's selectors (commas inside :where() / :is() do not split) */
const sels = (s: string) => { const out: string[] = []; let depth = 0, cur = ''; for (const ch of s) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = '' } else cur += ch } if (cur.trim()) out.push(cur.trim()); return out }

/** font-size / font-weight out of a `font:` shorthand (inherit and system keywords carry none) */
function fontParts(v: string): { size?: string; weight?: string } {
  if (/^(inherit|initial|unset|revert)$/.test(v)) return {}
  const m = /(?:^|\s)((?:\d{3}|bold|bolder|lighter|normal)\s+)?(?:[\w-]+\s+)*?((?:var\([^)]*\)|calc\([^)]*\)|[\d.]+(?:px|rem|em|%)))(?:\/[^\s]+)?\s/.exec(` ${v} `)
  if (!m) return {}
  const weight = /(^|\s)(\d{3}|bold|bolder|lighter)(\s|$)/.exec(v)?.[2]
  return { size: m[2], weight }
}
const fontSizeOk = (v: string) => /^var\(--t-[\w-]+\)$/.test(v) || /^calc\(.*var\(--t-[\w-]+\).*\)$/.test(v) || v === 'inherit'
const weightOk = (v: string) => /^(380|400|500|600|inherit)$/.test(v) || /^var\(--w-[\w-]+\)$/.test(v)

describe('the calm look, on every stylesheet', () => {
  it('there are stylesheets to check', () => {
    expect(sheets.length).toBeGreaterThan(5)
  })

  it('no px font-size (font-size or the font shorthand): only var(--t-*) or calc() of one', () => {
    for (const d of decls()) {
      if (d.prop === 'font-size') expect(fontSizeOk(d.value), `${d.file} ${d.sel}: font-size ${d.value}`).toBe(true)
      if (d.prop === 'font') { const p = fontParts(d.value); if (p.size) expect(fontSizeOk(p.size), `${d.file} ${d.sel}: font ${d.value}`).toBe(true) }
    }
  })

  it('font-weight only 380/400/500/600 or var(--w-*) (also inside font)', () => {
    for (const d of decls()) {
      if (d.prop === 'font-weight') expect(weightOk(d.value), `${d.file} ${d.sel}: font-weight ${d.value}`).toBe(true)
      if (d.prop === 'font') { const p = fontParts(d.value); if (p.weight) expect(weightOk(p.weight), `${d.file} ${d.sel}: font ${d.value}`).toBe(true) }
    }
  })

  it('radii (border-radius and its longhands) only var(--r-*), 0, 1px, 2px, 50 %; 999px only in switch.css and badge.css', () => {
    for (const d of decls()) {
      if (!/^border(-[a-z]+)*-radius$/.test(d.prop)) continue
      for (const part of d.value.split(/[\s/]+/)) {
        const ok = /^var\(--r-[\w-]+\)$/.test(part) || ['0', '1px', '2px', '50%', 'inherit'].includes(part) || (part === '999px' && ['switch.css', 'badge.css'].includes(d.file))
        expect(ok, `${d.file} ${d.sel}: ${d.prop} ${d.value}`).toBe(true)
      }
    }
  })

  it('var(--accent) appears only in switch.css (the allow-list later plans extend: send, chosen row, picked cell)', () => {
    const ACCENT_OK = ['switch.css']
    for (const d of decls()) if (/var\(--accent(?:-hover)?\)/.test(d.value)) expect(ACCENT_OK, `${d.file} ${d.sel} uses yellow`).toContain(d.file)
  })

  it('reduced motion: every selector that transitions or animates has, for that kind, a reduced-motion rule turning it off', () => {
    const all = decls()
    const moving = all.filter(d => !d.reduced && /^(transition|animation)(-[a-z-]+)?$/.test(d.prop) && !/^(none|0s?)$/.test(d.value) && !/-(timing-function|delay|direction|fill-mode|play-state|iteration-count)$/.test(d.prop))
    for (const d of moving) {
      const kind = d.prop.startsWith('transition') ? 'transition' : 'animation'
      for (const s of sels(d.sel)) {
        const off = all.some(x => x.reduced && x.file === d.file && sels(x.sel).includes(s) && (x.prop === kind || x.prop === `${kind}-${kind === 'transition' ? 'property' : 'name'}`) && /^none$/.test(x.value))
        expect(off, `${d.file} ${s}: ${d.prop} ${d.value} with no reduced-motion ${kind}: none`).toBe(true)
      }
    }
  })

  it('one focus ring, only on spawn-ui\'s own controls (never a bare :focus-visible that would restyle the host app), never yellow, never removed', () => {
    const all = decls()
    const ring = all.filter(d => d.file === 'base.css' && d.sel.includes(':focus-visible') && d.prop === 'outline')
    expect(ring.length).toBeGreaterThan(0)
    for (const r of ring) {
      expect(r.value).toBe('2px solid var(--ink-2)')
      for (const s of sels(r.sel)) expect(s, 'a bare :focus-visible restyles everything in the host app').toMatch(/\.sp-[\w-]+.*:focus-visible|:where\(.*\.sp-/)
    }
    for (const d of all) {
      if (d.prop === 'outline' || d.prop === 'outline-style' || d.prop === 'outline-width') {
        expect(/^(none|0)(\s|$)/.test(d.value), `${d.file} ${d.sel}: ${d.prop} ${d.value} removes the ring`).toBe(false)
        if (/:focus(?!-visible|-within)/.test(d.sel)) throw new Error(`${d.file} ${d.sel}: a :focus outline (a click would show it)`)
      }
      if (d.sel.includes(':focus-visible')) expect(/--accent/.test(d.value), `${d.file} ${d.sel}: a yellow ring`).toBe(false)
    }
  })
})

describe('the guard itself catches what it should (it once let these through)', () => {
  const bad = (text: string) => declsOf([{ file: 'x.css', text }])
  it('sees rules nested in @supports / @layer and in @media inside them', () => {
    const d = bad('@layer a { @supports (x: y) { @media (min-width: 1px) { .sp-a { font-size: 12px } } } }')
    expect(d.map(x => `${x.sel}|${x.prop}|${x.value}`)).toEqual(['.sp-a|font-size|12px'])
  })
  it('reads size and weight out of the font shorthand', () => {
    expect(fontParts('600 12px/1 sans-serif')).toEqual({ size: '12px', weight: '600' })
    expect(fontParts('inherit')).toEqual({})
    expect(fontParts('500 var(--t-ui) / 1.4 x')).toEqual({ size: 'var(--t-ui)', weight: '500' })
  })
})
