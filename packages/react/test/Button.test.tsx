import { fireEvent, render, screen } from '@testing-library/react'
import { Gear } from '@phosphor-icons/react'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import { Button, IconButton } from '../src'

const css = (dir: string, f: string) => readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'src', dir, f), 'utf8')
const rule = (text: string, sel: string) => new RegExp(`${sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{([^}]*)\\}`).exec(text)?.[1] ?? ''

describe('Button', () => {
  it('variant and size become classes; outline / sm by default; type button', () => {
    render(<Button>보내기</Button>)
    const b = screen.getByRole('button', { name: '보내기' })
    expect(b.className).toBe('sp-button sp-button--outline sp-button--sm')
    expect(b.getAttribute('type')).toBe('button')
    render(<Button variant="solid" size="md">허용</Button>)
    expect(screen.getByRole('button', { name: '허용' }).className).toBe('sp-button sp-button--solid sp-button--md')
  })
  it('disabled: no click', () => {
    const on = vi.fn()
    render(<Button disabled onClick={on}>지우기</Button>)
    fireEvent.click(screen.getByRole('button', { name: '지우기' }))
    expect(on).not.toHaveBeenCalled()
  })
  it('passes className, ref and other attributes', () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Button ref={ref} className="x" title="t" type="submit">a</Button>)
    expect(ref.current?.classList.contains('x')).toBe(true)
    expect(ref.current?.getAttribute('type')).toBe('submit')
  })
  it('its look is spawn\'s: xs is .chat-btn (24px), sm is .chat-card-btn (28px), md is .set-btn; solid fills with --ink', () => {
    const c = css('Button', 'button.css')
    expect(rule(c, '.sp-button--xs')).toMatch(/min-height:\s*24px/)
    expect(rule(c, '.sp-button--sm')).toMatch(/min-height:\s*28px/)
    expect(rule(c, '.sp-button--md')).toMatch(/padding:\s*6px 12px/)
    expect(rule(c, '.sp-button--solid')).toMatch(/background:\s*var\(--ink\)/)
    expect(rule(c, '.sp-button--solid')).toMatch(/color:\s*var\(--accent-ink\)/)
  })
})

describe('IconButton', () => {
  it('its label is its name and its tooltip', () => {
    render(<IconButton label="설정" icon={Gear} />)
    const b = screen.getByRole('button', { name: '설정' })
    expect(b.getAttribute('title')).toBe('설정')
    expect(b.className).toBe('sp-icon-button sp-icon-button--md')
  })
  it('its boxes are spawn\'s: xs 20, sm 22, md 24×22, lg 38', () => {
    const c = css('IconButton', 'icon-button.css')
    expect(rule(c, '.sp-icon-button--xs')).toMatch(/width:\s*20px;\s*height:\s*20px/)
    expect(rule(c, '.sp-icon-button--sm')).toMatch(/width:\s*22px;\s*height:\s*22px/)
    expect(rule(c, '.sp-icon-button--md')).toMatch(/width:\s*24px;\s*height:\s*22px/)
    expect(rule(c, '.sp-icon-button--lg')).toMatch(/width:\s*38px;\s*height:\s*38px/)
  })
  it('disabled: no click', () => {
    const on = vi.fn()
    render(<IconButton label="닫기" icon={Gear} disabled onClick={on} />)
    fireEvent.click(screen.getByRole('button', { name: '닫기' }))
    expect(on).not.toHaveBeenCalled()
  })
})
