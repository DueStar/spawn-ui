/** Plan 4, Task 4: DiffBlock. Values: chat.css 123–151, 377–388, 465–470 */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DiffBlock, type DiffLine } from '../src'
import { css, rule } from './css'

const LINES: DiffLine[] = [
  { type: 'ctx', text: 'a', old: 1, new: 1 },
  { type: 'del', text: 'b', old: 2 },
  { type: 'add', text: 'c', new: 2 },
]
const c = () => css('DiffBlock', 'diff-block.css')

describe('DiffBlock', () => {
  it('a well with the file (a button that opens it), the kind, the counts in words', () => {
    const open = vi.fn()
    render(<DiffBlock file="src/a.ts" kind="수정" lines={LINES} added={1} removed={1} onOpenFile={open} countsLabel="추가 1줄, 삭제 1줄" />)
    fireEvent.click(screen.getByRole('button', { name: 'src/a.ts' })); expect(open).toHaveBeenCalledTimes(1)
    expect(screen.getByLabelText('추가 1줄, 삭제 1줄').textContent).toBe('+1−1')
    expect(rule(c(), '.sp-diff')).toMatchObject({ background: 'var(--term-bg)', 'border-radius': 'var(--r-m)' })
    expect(rule(c(), '.sp-diff__head')).toMatchObject({ 'min-height': '30px', padding: '2px 10px' })
  })
  it('lines: grid 36 16 1fr (inline); add and del on their tints with their signs', () => {
    render(<DiffBlock file="f" lines={LINES} />)
    expect(document.querySelectorAll('.sp-diff__line').length).toBe(3)
    expect(document.querySelector('.sp-diff__line--add .sp-diff__sign')?.textContent).toBe('+')
    expect(rule(c(), '.sp-diff__line')['grid-template-columns']).toBe('36px 16px minmax(0, 1fr)')
    expect(rule(c(), '.sp-diff__line--add').background).toBe('var(--add-bg)')
    expect(rule(c(), '.sp-diff__line--del').background).toBe('var(--del-bg)')
  })
  it('inline scrolls sideways; card and panel wrap (card max 220); panel grid 32 14; no numbers 22', () => {
    expect(rule(c(), '.sp-diff__lines')['overflow-x']).toBe('auto')
    expect(rule(c(), '.sp-diff--card .sp-diff__lines')).toMatchObject({ 'max-height': '220px', 'overflow-x': 'hidden' })
    expect(rule(c(), '.sp-diff--card .sp-diff__line')['white-space']).toBe('pre-wrap')
    expect(rule(c(), '.sp-diff--panel .sp-diff__line')['grid-template-columns']).toBe('32px 14px minmax(0, 1fr)')
    expect(rule(c(), '.sp-diff__line--nonum')['grid-template-columns']).toBe('22px minmax(0, 1fr)')
  })
  it('a more row (named) after the shown lines', () => {
    const more = vi.fn()
    render(<DiffBlock file="f" lines={LINES} maxLines={1} moreLabel="2줄 더 보기" onMore={more} />)
    expect(document.querySelectorAll('.sp-diff__line').length).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: '2줄 더 보기' })); expect(more).toHaveBeenCalledTimes(1)
    expect(rule(c(), '.sp-diff__more')).toMatchObject({ 'min-height': '26px', padding: '0 12px 0 52px' })
  })
})
