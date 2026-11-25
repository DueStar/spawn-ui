import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { Badge, Meter, meterTone, Pill, StatusDot, Tag } from '../src'

const css = (d: string, f: string) => readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'src', d, f), 'utf8')

describe('Meter: spawn\'s thresholds', () => {
  it('usage: grey under 80 %, amber from 80 %, red from 90 %', () => {
    expect(meterTone('usage', 0.79)).toBe('ok')
    expect(meterTone('usage', 0.8)).toBe('warn')
    expect(meterTone('usage', 0.89)).toBe('warn')
    expect(meterTone('usage', 0.9)).toBe('danger')
  })
  it('hp: green over 50 %, amber at 50 % and under, red at 20 % and under', () => {
    expect(meterTone('hp', 0.51)).toBe('ok')
    expect(meterTone('hp', 0.5)).toBe('warn')
    expect(meterTone('hp', 0.21)).toBe('warn')
    expect(meterTone('hp', 0.2)).toBe('danger')
  })
  it('a named meter, value clamped to 0–100', () => {
    render(<><Meter kind="hp" value={1.4} label="컨텍스트" /><Meter kind="usage" value={-0.1} label="5시간" /></>)
    expect(screen.getByRole('meter', { name: '컨텍스트' }).getAttribute('aria-valuenow')).toBe('100')
    expect(screen.getByRole('meter', { name: '5시간' }).getAttribute('aria-valuenow')).toBe('0')
  })
  it('heights: usage 2px (--bar-h), hp 3px (--hp-h)', () => {
    const c = css('Meter', 'meter.css')
    expect(c).toMatch(/\.sp-meter--usage\s*\{[^}]*height:\s*var\(--bar-h\)/)
    expect(c).toMatch(/\.sp-meter--hp\s*\{[^}]*height:\s*var\(--hp-h\)/)
  })
})

describe('StatusDot, Tag, Pill, Badge', () => {
  it('a dot never says it by colour alone: its label is read', () => {
    render(<StatusDot tone="green" label="일하는 중" />)
    expect(screen.getByText('일하는 중').className).toBe('sp-visually-hidden')
  })
  it('a tier: the dot beside its word, never a filled chip', () => {
    const { container } = render(<Tag tier="legendary">전설</Tag>)
    const tag = container.querySelector('.sp-tag')!
    expect(tag.classList.contains('tier-legendary')).toBe(true)
    expect(tag.querySelector('.tdot')).toBeTruthy()
    expect(tag.textContent).toBe('전설')
    expect(css('Tag', 'tag.css')).not.toMatch(/\.sp-tag[^{]*\{[^}]*background/)
  })
  it('a long tag or pill: one line, the whole in its title', () => {
    const long = '아주아주 긴 태그 이름이 들어가도 한 줄'
    render(<><Tag>{long}</Tag><Pill mood="working">{long + '!'}</Pill></>)
    expect(screen.getByTitle(long).querySelector('.sp-truncate')).toBeTruthy()
    expect(screen.getByTitle(long + '!').querySelector('.sp-truncate')).toBeTruthy()
  })
  it('a pill with onClick is a button; without, plain text', () => {
    const { rerender } = render(<Pill mood="needs-you">확인 필요</Pill>)
    expect(screen.queryByRole('button')).toBeNull()
    rerender(<Pill mood="needs-you" onClick={() => {}}>확인 필요</Pill>)
    expect(screen.getByRole('button', { name: '확인 필요' })).toBeTruthy()
  })
  it('a badge is the one 999px pill, on the reward yellow', () => {
    const { container } = render(<Badge tone="new">NEW</Badge>)
    expect(container.querySelector('.sp-badge--new')).toBeTruthy()
    expect(css('Badge', 'badge.css')).toMatch(/border-radius:\s*999px/)
  })
})

describe('Tag whole (spawn 5b: 이어하기 badges)', () => {
  it('whole: the word as plain text, no truncating span (a clipped edge pixel of the last glyph, as spawn draws it whole)', () => {
    const { container } = render(<Tag tone="run" whole>실행 중</Tag>)
    expect(container.querySelector('.sp-truncate')).toBeNull()
    expect(container.querySelector('.sp-tag')?.textContent).toBe('실행 중')
  })
  it('by default it still truncates', () => {
    const { container } = render(<Tag>새로 등록</Tag>)
    expect(container.querySelector('.sp-tag .sp-truncate')).not.toBeNull()
  })
})
