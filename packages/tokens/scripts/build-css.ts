/** Writes dist/tokens.css from src/tokens.ts (the one source) */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { color, measure, motion, radius, tier, type, typeScale, weight, type TypeStep } from '../src/tokens'

const decl = (o: Record<string, string>) => Object.entries(o).map(([k, v]) => `  --${k}: ${v};`).join('\n')
const steps = (t: Record<TypeStep, number>) => Object.entries(t).map(([k, v]) => `--t-${k}: ${v}px;`).join(' ')

const css = `/* @spawn-ui/tokens — generated from src/tokens.ts. Do not edit. */
:root {
${decl(color)}
${decl(weight)}
${decl(radius)}
${decl(measure)}
  --ease: ${motion.ease};  --dur-fast: ${motion.fast}ms;  --dur-base: ${motion.base}ms;
  ${steps(type)}
}
/* the other text sizes: on the page (:root.ts-N, as spawn) or on one part of it (.sp-ts-N, a docs preview) */
${Object.entries(typeScale).map(([n, t]) => `:root.ts-${n}, .sp-ts-${n} { ${steps(t)} }`).join('\n')}
/* tier colours are information: text and dot colour, never a fill */
${Object.entries(tier).map(([k, v]) => `.tier-${k} { --tier: ${v}; }`).join('\n')}
/* a tier is shown as this dot beside its word (the word always there: tiers never rely on hue alone) */
.tdot { display: inline-block; flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--tier); }
`
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'tokens.css'), css)
