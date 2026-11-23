import { fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import React, { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox, RadioGroup, Switch } from '../src'

const css = (d: string, f: string) => readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'src', d, f), 'utf8')

describe('Switch', () => {
  it('a named switch; a click turns it on, with the new value', () => {
    const on = vi.fn()
    render(<Switch label="링크 미리보기" checked={false} onCheckedChange={on} />)
    const s = screen.getByRole('switch', { name: '링크 미리보기' })
    expect(s.getAttribute('aria-checked')).toBe('false')
    fireEvent.click(s)
    expect(on).toHaveBeenCalledWith(true)
  })
  it('disabled: no change', () => {
    const on = vi.fn()
    render(<Switch label="자동 정렬" checked onCheckedChange={on} disabled />)
    fireEvent.click(screen.getByRole('switch', { name: '자동 정렬' }))
    expect(on).not.toHaveBeenCalled()
  })
  it('spawn\'s look (.set-switch): 32×18, on is yellow with the ink knob; the knob\'s slide stops under reduced motion', () => {
    const c = css('Switch', 'switch.css')
    expect(c).toMatch(/\.sp-switch\s*\{[^}]*width:\s*32px;[^}]*height:\s*18px/)
    expect(c).toMatch(/\.sp-switch\[data-checked\]\s*\{[^}]*background:\s*var\(--accent\)/)
    expect(c).toMatch(/prefers-reduced-motion/)
  })
})

describe('Checkbox', () => {
  it('a named checkbox that toggles', () => {
    function T() { const [v, set] = useState(false); return <Checkbox label="여러 개" checked={v} onCheckedChange={set} /> }
    render(<T />)
    const c = screen.getByRole('checkbox', { name: '여러 개' })
    fireEvent.click(c)
    expect(c.getAttribute('aria-checked')).toBe('true')
  })
})

describe('RadioGroup', () => {
  it('named radios; a click chooses; the chosen is checked', () => {
    const on = vi.fn()
    render(<RadioGroup label="답" value="a" onValueChange={on} options={[{ value: 'a', label: '네' }, { value: 'b', label: '아니요' }]} />)
    expect(screen.getByRole('radiogroup', { name: '답' })).toBeTruthy()
    expect(screen.getByRole('radio', { name: '네' }).getAttribute('aria-checked')).toBe('true')
    fireEvent.click(screen.getByRole('radio', { name: '아니요' }))
    expect(on).toHaveBeenCalledWith('b')
  })
  it('the marks are spawn\'s .chat-card-mark: a 12px ring, filled --ink when chosen; never yellow', () => {
    const c = css('RadioGroup', 'radio.css') + css('Checkbox', 'checkbox.css')
    expect(c).toMatch(/width:\s*12px;\s*height:\s*12px/)
    expect(c).not.toMatch(/--accent/)
  })
})
