import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { contrast, tokens, type Tier } from '../src/index'

const here = dirname(fileURLToPath(import.meta.url))
const read = (...p: string[]) => readFileSync(join(here, '..', ...p), 'utf8')
const baseline = read('test', 'fixtures', 'spawn-tokens-2026-11-23.css').replace(/\/\*[\s\S]*?\*\//g, '')
const built = () => read('dist', 'tokens.css').replace(/\/\*[\s\S]*?\*\//g, '')

/** The custom properties of the first block whose selector is exactly `sel` */
function block(css: string, sel: string): Record<string, string> {
  const esc = sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const m = new RegExp(`(?:^|\\})\\s*${esc}\\s*\\{([^}]*)\\}`).exec(css)
  if (!m) throw new Error(`no block ${sel}`)
  return Object.fromEntries([...m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(x => [x[1], x[2].trim()]))
}

describe('@spawn-ui/tokens: spawn\'s values, unchanged', () => {
  it('every var in the spawn baseline has the same value in dist/tokens.css', () => {
    const want = block(baseline, ':root')
    const got = block(built(), ':root')
    for (const [k, v] of Object.entries(want)) expect(got[k], k).toBe(v)
  })

  it('text classes: :root.ts-N and .sp-ts-N carry the baseline\'s ts-N values', () => {
    for (const n of [80, 90, 110, 120, 130]) {
      const want = block(baseline, `:root.ts-${n}`)
      const got = block(built(), `:root.ts-${n}, .sp-ts-${n}`)
      expect(got, `ts-${n}`).toEqual(want)
    }
  })

  it('tier classes and .tdot are kept as in the baseline', () => {
    for (const t of ['common', 'rare', 'sub', 'legendary', 'mythical'] as Tier[]) {
      expect(block(built(), `.tier-${t}`), t).toEqual(block(baseline, `.tier-${t}`))
    }
    const dot = (css: string) => /\.tdot\s*\{([^}]*)\}/.exec(css)?.[1].replace(/\s+/g, ' ').trim()
    expect(dot(built())).toBe(dot(baseline))
  })

  it('the typed export matches the CSS', () => {
    const root = block(built(), ':root')
    expect(tokens.color.ink).toBe(root['--ink'])
    expect(tokens.color['ink-2']).toBe(root['--ink-2'])
    expect(tokens.radius['r-m']).toBe(root['--r-m'])
    expect(tokens.type.ui).toBe(12)
    expect(tokens.typeScale[130].prose).toBe(17)
    expect(tokens.tier.legendary).toBe('#ffc94a')
  })
})

describe('contrast floors (spawn tests/tokens.test.ts)', () => {
  const c = tokens.color
  it('--ink on --bg/--side-bg/--card/--card-2 ≥ 4.5; --ink-2 and --ink-3 ≥ 3', () => {
    for (const bg of ['bg', 'side-bg', 'card', 'card-2']) {
      expect(contrast(c.ink, c[bg]), `ink on ${bg}`).toBeGreaterThanOrEqual(4.5)
      expect(contrast(c['ink-2'], c[bg]), `ink-2 on ${bg}`).toBeGreaterThanOrEqual(3)
      expect(contrast(c['ink-3'], c[bg]), `ink-3 on ${bg}`).toBeGreaterThanOrEqual(3)
    }
  })
  it('every tier ≥ 3 on --bg, --card, --toast-bg', () => {
    for (const [t, v] of Object.entries(tokens.tier)) {
      for (const bg of ['bg', 'card', 'toast-bg']) expect(contrast(v, c[bg]), `${t} on ${bg}`).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('motion (the one addition)', () => {
  it('--ease is cubic-bezier(0.2, 0, 0, 1)', () => {
    const root = block(built(), ':root')
    expect(root['--ease']).toBe('cubic-bezier(0.2, 0, 0, 1)')
    expect(tokens.motion.ease).toBe('cubic-bezier(0.2, 0, 0, 1)')
  })
})
