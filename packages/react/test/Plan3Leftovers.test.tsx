/** Plan 3, Task 1: the Tag tones and the full-HP Meter carried over from plans 1–2 */
import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { Meter, Tag } from '../src'
import { css, rule } from './css'

describe('Tag tones', () => {
  const c = () => css('Tag', 'tag.css')
  it('badge (resume-badge, we:320): --ink-2 in a --line hairline, 0 5px, --r-xs, the size of the line it sits in', () => {
    render(<Tag tone="badge">main</Tag>)
    expect(screen.getByText('main').parentElement?.className).toBe('sp-tag sp-tag--badge')
    expect(rule(c(), '.sp-tag--badge')).toMatchObject({ color: 'var(--ink-2)', 'font-size': 'inherit' })
  })
  it('run (resume-badge.run): amber words and an amber 38 % hairline', () => {
    render(<Tag tone="run">실행 중</Tag>)
    expect(screen.getByText('실행 중').parentElement?.className).toBe('sp-tag sp-tag--run')
    expect(rule(c(), '.sp-tag--run')).toMatchObject({ color: 'var(--amber)', 'border-color': 'color-mix(in srgb, var(--amber) 38%, transparent)', 'font-size': 'inherit' })
  })
})

describe('Meter full', () => {
  it('a full context (hp-full): the bar fades to 0.35, in --hp', () => {
    render(<Meter kind="hp" value={1} full label="컨텍스트 가득" />)
    expect(screen.getByRole('meter').className).toContain('sp-meter--full')
    expect(rule(css('Meter', 'meter.css'), '.sp-meter--full .sp-meter__fill')).toMatchObject({ opacity: '0.35', background: 'var(--hp)' })
  })
})
