import { fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { SegmentedControl } from '../src'

const SORTS = [{ value: 'mine', label: '내 순서' }, { value: 'recent', label: '최근' }, { value: 'dex', label: '번호' }] as const
const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'SegmentedControl', 'segmented.css'), 'utf8')

describe('SegmentedControl', () => {
  it('a named group; the chosen one is pressed', () => {
    render(<SegmentedControl label="정렬" value="recent" options={[...SORTS]} onChange={() => {}} />)
    expect(screen.getByRole('group', { name: '정렬' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '최근' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: '번호' }).getAttribute('aria-pressed')).toBe('false')
  })
  it('a click chooses once; the chosen one again does nothing', () => {
    const on = vi.fn()
    render(<SegmentedControl label="정렬" value="recent" options={[...SORTS]} onChange={on} />)
    fireEvent.click(screen.getByRole('button', { name: '번호' }))
    fireEvent.click(screen.getByRole('button', { name: '최근' }))
    expect(on.mock.calls).toEqual([['dex']])
  })
  it('← / → move the focus between the buttons (wrapping); a disabled one is skipped', () => {
    render(<SegmentedControl label="정렬" value="mine" options={[SORTS[0], { ...SORTS[1], disabled: true }, SORTS[2]]} onChange={() => {}} />)
    const first = screen.getByRole('button', { name: '내 순서' })
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '번호' }))
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(first)
  })
  it('a long label: one line with an ellipsis, the whole in its title', () => {
    const long = '아주 긴 정렬 이름이 들어가도 한 줄로 보여요'
    render(<SegmentedControl label="보기" value="a" options={[{ value: 'a', label: long }]} onChange={() => {}} />)
    const b = screen.getByRole('button', { name: long })
    expect(b.getAttribute('title')).toBe(long)
    expect(b.querySelector('.sp-truncate')).toBeTruthy()
  })
  it('spawn\'s look: the chosen --sel-bg and --ink; hovered words stay --ink-2 and the chosen one is not restyled; never yellow', () => {
    expect(css).toMatch(/\.sp-segmented__item\[aria-pressed="true"\]\s*\{[^}]*background:\s*var\(--sel-bg\);[^}]*color:\s*var\(--ink\)/)
    expect(css).toMatch(/\.sp-segmented__item\[aria-pressed="false"\]:not\(:disabled\):hover\s*\{[^}]*color:\s*var\(--ink-2\)/)
    expect(css).not.toMatch(/--accent/)
  })
})
