/**
 * The final review's findings (2026-11-23), each pinned: the focus ring reaches every control of the package and
 * only them; spawn's exact values where adoption would otherwise move pixels; long tags truncate; the tokens
 * dependency installs from a tarball.
 */
import { render, screen } from '@testing-library/react'
import { Gear } from '@phosphor-icons/react'
import postcss, { type Rule } from 'postcss'
import { css, rule } from './css'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { Button, Checkbox, IconButton, Meter, Pill, RadioGroup, SegmentedControl, Switch } from '../src'

const here = dirname(fileURLToPath(import.meta.url))
describe('the focus ring reaches every interactive control, and each is reachable by Tab', () => {
  const ringSel = () => {
    let s = ''
    postcss.parse(css('styles', 'base.css')).walkRules((r: Rule) => { if (r.selector.includes(':focus-visible') && r.selector !== '.sp-inset-ring:focus-visible') s = r.selector })
    return s
  }
  it('the ring rule names each control\'s focusable class', () => {
    const s = ringSel()
    for (const c of ['.sp-button', '.sp-icon-button', '.sp-segmented__item', '.sp-switch', '.sp-mark', '.sp-pill--button']) expect(s, c).toContain(c)
  })
  it('each control renders a focusable element carrying that class', () => {
    render(<>
      <Button>a</Button>
      <IconButton label="b" icon={Gear} />
      <SegmentedControl label="c" value="x" options={[{ value: 'x', label: 'x' }]} onChange={() => {}} />
      <Switch label="d" checked={false} onCheckedChange={() => {}} />
      <Checkbox label="e" checked={false} onCheckedChange={() => {}} />
      <RadioGroup label="f" value="y" onValueChange={() => {}} options={[{ value: 'y', label: 'y' }]} />
      <Pill mood="needs-you" onClick={() => {}}>g</Pill>
    </>)
    const focusable = (el: Element) => (el as HTMLElement).tabIndex >= 0
    for (const [role, name, cls] of [['button', 'a', 'sp-button'], ['button', 'b', 'sp-icon-button'], ['button', 'x', 'sp-segmented__item'], ['switch', 'd', 'sp-switch'], ['checkbox', 'e', 'sp-mark'], ['radio', 'y', 'sp-mark'], ['button', 'g', 'sp-pill--button']] as const) {
      const el = screen.getByRole(role, { name })
      expect(el.classList.contains(cls), `${role} ${name} has .${cls}`).toBe(true)
      expect(focusable(el), `${role} ${name} is reachable by Tab`).toBe(true)
    }
  })
})

describe('spawn\'s exact values (adoption moves no pixel)', () => {
  it('IconButton head: the header\'s 26×26, --ink-3, hover --hover (spawn .w-head .w-icon)', () => {
    render(<IconButton size="head" label="설정" icon={Gear} />)
    expect(screen.getByRole('button', { name: '설정' }).className).toBe('sp-icon-button sp-icon-button--head')
    const c = css('IconButton', 'icon-button.css')
    expect(rule(c, '.sp-icon-button--head')).toMatchObject({ width: '26px', height: '26px', color: 'var(--ink-3)' })
    expect(rule(c, '.sp-icon-button--head:not(:disabled):hover')).toMatchObject({ background: 'var(--hover)' })
  })
  it('Button xs disabled fades to 0.5 (spawn .chat-card .chat-btn:disabled), md to 0.45 (.set-btn:disabled)', () => {
    const c = css('Button', 'button.css')
    expect(rule(c, '.sp-button--xs:disabled')).toMatchObject({ opacity: '0.5' })
    expect(rule(c, '.sp-button--md:disabled')).toMatchObject({ opacity: '0.45' })
  })
  it('Button link: the size it is put in (no font-size of its own), hover underlines in --ink (spawn .chat-link-btn)', () => {
    const c = css('Button', 'button.css')
    expect(rule(c, '.sp-button--link').font).toBe('inherit')
    expect(rule(c, '.sp-button--link.sp-button--sm')['font-size']).toBe('inherit')
    expect(rule(c, '.sp-button--link:not(:disabled):hover')).toMatchObject({ color: 'var(--ink)', 'text-decoration-color': 'var(--ink)' })
  })
  it('Button ghost md keeps its hairline (spawn .set-btn.ghost)', () => {
    const c = css('Button', 'button.css')
    expect(rule(c, '.sp-button--ghost.sp-button--md')).toMatchObject({ 'border-color': 'var(--line)' })
  })
  it('Switch disabled only stops the pointer (spawn .set-switch:disabled): no fading', () => {
    expect(rule(css('Switch', 'switch.css'), '.sp-switch[data-disabled]').opacity).toBeUndefined()
  })
  it('Pill as a button has spawn\'s 1px vertical padding (.w-pill.as-button)', () => {
    expect(rule(css('Pill', 'pill.css'), '.sp-pill--button')).toMatchObject({ padding: '1px 0' })
  })
  it('Meter hp drains like spawn\'s (width .6s ease-out, colour .3s; none under reduced motion); usage is not a flex item of its own', () => {
    const c = css('Meter', 'meter.css')
    expect(rule(c, '.sp-meter--hp .sp-meter__fill').transition).toBe('width 0.6s ease-out, background-color 0.3s')
    expect(rule(c, '.sp-meter--usage').flex).toBeUndefined()
    render(<Meter kind="hp" value={1} label="h" />)
  })
})

describe('Tag in a narrow flex row', () => {
  it('can shrink below its text, so the ellipsis shows', () => {
    expect(rule(css('Tag', 'tag.css'), '.sp-tag')['min-width']).toBe('0')
  })
})

describe('the packages install from tarballs', () => {
  it('@spawn-ui/react pins its tokens to the version released with it, and ships a README and LICENSE', () => {
    const pkg = JSON.parse(readFileSync(join(here, '..', 'package.json'), 'utf8'))
    const tokens = JSON.parse(readFileSync(join(here, '..', '..', 'tokens', 'package.json'), 'utf8'))
    expect(pkg.dependencies['@spawn-ui/tokens']).toBe(`^${tokens.version}`)
    for (const p of [join(here, '..'), join(here, '..', '..', 'tokens')]) {
      const j = JSON.parse(readFileSync(join(p, 'package.json'), 'utf8'))
      expect(j.files, p).toEqual(expect.arrayContaining(['dist', 'README.md', 'LICENSE']))
      expect(() => readFileSync(join(p, 'README.md'))).not.toThrow()
      expect(() => readFileSync(join(p, 'LICENSE'))).not.toThrow()
    }
  })
})
