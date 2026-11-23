import { render } from '@testing-library/react'
import { Gear } from '@phosphor-icons/react'
import { describe, expect, it } from 'vitest'
import { Icon, iconStep } from '../src'

describe('Icon: Phosphor at one weight, three sizes', () => {
  it('snaps sizes to 12 / 14 / 16 (a picture-sized one keeps its size)', () => {
    expect(iconStep(11)).toBe(12)
    expect(iconStep(13)).toBe(14)
    expect(iconStep(20)).toBe(20)
    expect(iconStep(16)).toBe(16)
    expect(iconStep(15)).toBe(16)
  })
  it('renders the snapped size, bold, hidden from screen readers without a label', () => {
    const { container } = render(<Icon icon={Gear} size={13} />)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('width')).toBe('14')
    expect(svg.getAttribute('aria-hidden')).toBe('true')
    expect(svg.classList.contains('sp-icon')).toBe(true)
  })
  it('with a label: role img and its name', () => {
    const { getByRole } = render(<Icon icon={Gear} label="설정" />)
    expect(getByRole('img', { name: '설정' })).toBeTruthy()
  })
})
