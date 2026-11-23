/** Read a component's stylesheet and the declarations a selector gets (as the browser applies them, motion on) */
import postcss, { type Rule } from 'postcss'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
export const css = (d: string, f: string) => readFileSync(join(here, '..', 'src', d, f), 'utf8')
/** The declarations of every rule whose selector list holds `sel` (later rules win, as in the browser) */
export function rule(text: string, sel: string): Record<string, string> {
  const out: Record<string, string> = {}
  postcss.parse(text).walkRules((r: Rule) => {
    // (as the page is with motion on: a reduced-motion rule is not the normal look)
    // (the normal look: not a reduced-motion rule, nor a narrow-window or container one)
    if (r.parent?.type === 'atrule' && /prefers-reduced-motion|max-width|min-width/.test((r.parent as postcss.AtRule).params)) return
    if (r.selectors.map(x => x.trim()).includes(sel)) r.walkDecls(d => { out[d.prop] = d.value })
  })
  return out
}
