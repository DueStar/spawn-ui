/**
 * spawn's design tokens — the one source. `scripts/build-css.ts` writes `dist/tokens.css` from these, so the CSS
 * and the typed export cannot drift. Values are spawn's `src/styles/tokens.css` (차분하게 2) as of 2026-11-23,
 * names unchanged; the only addition is motion.
 */

export type Tier = 'common' | 'rare' | 'sub' | 'legendary' | 'mythical'
export type TypeStep = 'micro' | 'meta' | 'ui' | 'name' | 'prose' | 'num' | 'head' | 'big' | 'code'
export type TextScale = 80 | 90 | 110 | 120 | 130

/** One group of custom properties, written in this order, each line a set of `--name: value` pairs */
export interface Group { comment: string; lines: Record<string, string>[] }

export const color = {
  // surfaces
  bg: '#0b0c10', 'side-bg': '#0e1015', card: '#14161c', 'card-2': '#1b1e26',
  'term-bg': '#101218', 'mon-bg': '#16181d', 'mon-bg-hover': '#1a1c22',
  'unknown-bg': '#131519', 'q-ink': '#2c303b', 'toast-bg': '#14161c', 'toast-art-bg': '#1d1e22',
  // the three greys, and numbers
  ink: '#d7dae3', 'ink-2': '#a4a9b6', 'ink-3': '#7d8291', 'num-ink': '#d7dae3',
  // lines and neutral states
  line: 'rgba(255, 255, 255, 0.07)', 'line-hover': 'rgba(255, 255, 255, 0.22)',
  track: 'rgba(255, 255, 255, 0.08)', hover: 'rgba(255, 255, 255, 0.045)',
  'sel-bg': 'rgba(255, 255, 255, 0.06)', 'row-sel-bg': 'rgba(255, 255, 255, 0.04)',
  // yellow: the chosen session, the chosen cell, send
  accent: '#f2c94c', 'accent-hover': '#f7d76c', 'accent-ink': '#16171b',
  // status
  green: '#74d68b', amber: '#ffb54a', danger: '#ff6464', 'red-text': '#ff8787',
  // HP and usage
  hp: '#5fcf7a', 'hp-warn': 'var(--amber)', 'hp-low': 'var(--danger)',
  bar: 'var(--ink-3)', 'bar-warn': 'var(--amber)', 'bar-danger': 'var(--danger)',
  // rewards keep their colour
  'new-dot': '#ff4d4f', 'new-badge': '#ffd84a', shiny: '#fff3a0',
  'metal-1': '#ffd84a', 'metal-2': '#c9ced8', 'metal-3': '#e3a76f',
  // the chat view
  'add-bg': 'rgba(116, 214, 139, 0.07)', 'del-bg': 'rgba(255, 100, 100, 0.07)',
  'find-bg': 'rgba(255, 255, 255, 0.12)', 'find-now-bg': 'rgba(255, 255, 255, 0.28)',
} as Record<string, string>

export const weight = { 'w-body': '400', 'w-name': '500', 'w-strong': '500', 'w-head': '600', 'w-mono': '380' }
export const radius = { 'r-xs': '3px', 'r-s': '4px', 'r-m': '6px', 'r-l': '8px', 'r-toast': '14px' }
export const measure = {
  'hp-h': '3px', 'bar-h': '2px',
  'head-h': '44px', 'sess-bar-h': '40px', 'rail-w': '56px', 'side-w': '300px',
  'row-gap': '4px', 'row-gap-compact': '2px', 'row-mon': '24px', 'row-mon-compact': '20px', 'strip-mon': '21px',
  'read-w': '840px',
}

/** Text steps in px at 100 % */
export const type: Record<TypeStep, number> = { micro: 10, meta: 11, ui: 12, name: 12, prose: 13, num: 12, head: 14, big: 15, code: 12 }
/** The other text sizes (spawn src/textSize.ts; at least 9px) */
export const typeScale: Record<TextScale, Record<TypeStep, number>> = {
  80: { micro: 9, meta: 9, ui: 10, name: 10, prose: 10, num: 10, head: 11, big: 12, code: 10 },
  90: { micro: 9, meta: 10, ui: 11, name: 11, prose: 12, num: 11, head: 13, big: 14, code: 11 },
  110: { micro: 11, meta: 12, ui: 13, name: 13, prose: 14, num: 13, head: 15, big: 17, code: 13 },
  120: { micro: 12, meta: 13, ui: 14, name: 14, prose: 16, num: 14, head: 17, big: 18, code: 14 },
  130: { micro: 13, meta: 14, ui: 16, name: 16, prose: 17, num: 16, head: 18, big: 20, code: 16 },
}

/** Tier colours are information: text and dot colour, never a fill */
export const tier: Record<Tier, string> = { common: '#a4a9b6', rare: '#6cb6ff', sub: '#c08bff', legendary: '#ffc94a', mythical: '#ff7ad9' }

/** The one easing spawn uses, and its durations (ms) */
export const motion = { ease: 'cubic-bezier(0.2, 0, 0, 1)', fast: 120, base: 180 }

export const fonts = {
  sans: "'W Pretendard', 'Pretendard Variable', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Hiragino Sans', system-ui, sans-serif",
  mono: "'Monaspace Neon Var', Consolas, 'SF Mono', Menlo, monospace",
}

export const tokens = { color, weight, radius, measure, type, typeScale, tier, motion, fonts }
