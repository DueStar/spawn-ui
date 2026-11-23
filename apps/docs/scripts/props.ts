/** src/data/props.json: every exported component's props, from @spawn-ui/react's TS types (react-docgen-typescript) */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { withCustomConfig } from 'react-docgen-typescript'

const here = dirname(fileURLToPath(import.meta.url))
const pkg = join(here, '..', '..', '..', 'packages', 'react')
const parser = withCustomConfig(join(pkg, 'tsconfig.json'), {
  savePropValueAsString: true, shouldExtractLiteralValuesFromEnum: true, shouldRemoveUndefinedFromOptional: true,
  propFilter: p => !p.parent || !/node_modules/.test(p.parent.fileName),
})
import { readdirSync, statSync } from 'node:fs'
const src = join(pkg, 'src')
const files = readdirSync(src).filter(d => statSync(join(src, d)).isDirectory() && d !== 'styles')
  .flatMap(d => readdirSync(join(src, d)).filter(f => f.endsWith('.tsx')).map(f => join(src, d, f)))
const out: Record<string, { name: string; type: string; required: boolean; default: string | null; description: string }[]> = {}
for (const doc of parser.parse(files)) {
  out[doc.displayName] = Object.values(doc.props).map(p => ({
    name: p.name, type: p.type.raw ?? p.type.name, required: p.required, default: p.defaultValue?.value ?? null, description: p.description,
  }))
}
mkdirSync(join(here, '..', 'src', 'data'), { recursive: true })
writeFileSync(join(here, '..', 'src', 'data', 'props.json'), JSON.stringify(out, null, 2))
console.log(`props: ${Object.keys(out).length} components`)
