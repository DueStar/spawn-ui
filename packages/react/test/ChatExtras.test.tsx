/** Plan 4, Task 7: LinkCard, AgentChip, SidePanel, Lightbox. Values: chat.css 41–51, 322–334, 422–437, 620–640 */
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AgentChip, Lightbox, LinkCard, SidePanel } from '../src'
import { css, rule } from './css'

describe('LinkCard', () => {
  it('one link named by its title; the description cut at 2 lines; the picture 104×68', () => {
    const o = vi.fn()
    render(<LinkCard url="https://example.com/a" site="example.com" title="예시 문서" desc="설명" image="x.png" label="링크 미리보기: 예시 문서" onOpen={o} />)
    fireEvent.click(screen.getByRole('link', { name: '링크 미리보기: 예시 문서' })); expect(o).toHaveBeenCalledTimes(1)
    const c = css('LinkCard', 'link-card.css')
    expect(rule(c, '.sp-og')).toMatchObject({ 'max-width': '480px', padding: '10px 10px 10px 12px', border: '1px solid var(--line)', 'border-radius': 'var(--r-l)' })
    expect(rule(c, '.sp-og--img')['grid-template-columns']).toBe('minmax(0, 1fr) 104px')
    expect(rule(c, '.sp-og__desc')['-webkit-line-clamp']).toBe('2')
    expect(rule(c, '.sp-og__img')).toMatchObject({ width: '104px', height: '68px', 'border-radius': 'var(--r-s)' })
  })
})

describe('AgentChip', () => {
  it('a named button: h28, max 340, 0 11px 0 10px, --r-l, a faint fill; its state as a dot (green / amber) and in its name', () => {
    const o = vi.fn()
    render(<AgentChip name="리뷰어" stateLabel="기다리는 중" state="wait" time="12초" onOpen={o} />)
    fireEvent.click(screen.getByRole('button', { name: /리뷰어.*기다리는 중/ })); expect(o).toHaveBeenCalledTimes(1)
    const c = css('AgentChip', 'agent-chip.css')
    expect(rule(c, '.sp-agent-chip')).toMatchObject({ height: '28px', 'max-width': '340px', padding: '0 11px 0 10px', 'border-radius': 'var(--r-l)', background: 'rgba(255, 255, 255, 0.025)', 'font-size': 'var(--t-meta)' })
    expect(rule(c, '.sp-agent-chip--wait .sp-agent-chip__mark i').background).toBe('var(--amber)')
  })
})

describe('SidePanel', () => {
  it('a named complementary region at the right on --side-bg; head 40 with its close; over: a shadow', () => {
    const off = vi.fn()
    render(<SidePanel title="변경 사항" width={320} onClose={off} closeLabel="닫기" sub="파일 3개">x</SidePanel>)
    expect(screen.getByRole('complementary', { name: '변경 사항' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '닫기' })); expect(off).toHaveBeenCalledTimes(1)
    const c = css('SidePanel', 'side-panel.css')
    expect(rule(c, '.sp-side-panel')).toMatchObject({ position: 'absolute', right: '0', background: 'var(--side-bg)', 'border-left': '1px solid var(--line)' })
    expect(rule(c, '.sp-side-panel__head')).toMatchObject({ height: '40px', padding: '0 8px 0 14px' })
    expect(rule(c, '.sp-side-panel--over')['box-shadow']).toBe('-12px 0 32px rgba(0, 0, 0, 0.35)')
  })
})

describe('Lightbox', () => {
  const pics = [{ src: 'a.png', alt: '첫째' }, { src: 'b.png', alt: '둘째' }]
  it('a dialog showing the picture; ← → and the round buttons move; named', async () => {
    const user = userEvent.setup()
    const go = vi.fn()
    render(<Lightbox pictures={pics} index={0} onIndex={go} onClose={() => {}} labels={{ title: '사진', prev: '이전 사진', next: '다음 사진', close: '닫기' }} />)
    expect(await screen.findByRole('dialog', { name: '사진' })).toBeTruthy()
    expect(screen.getByAltText('첫째')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '다음 사진' })); expect(go).toHaveBeenLastCalledWith(1)
    await user.keyboard('{ArrowLeft}'); expect(go).toHaveBeenLastCalledWith(1)
    const c = css('Lightbox', 'lightbox.css')
    expect(rule(c, '.sp-lightbox__img')).toMatchObject({ 'max-width': '92vw', 'max-height': '84vh', 'border-radius': 'var(--r-m)', background: '#fff' })
    expect(rule(c, '.sp-lightbox__nav')).toMatchObject({ width: '40px', height: '40px', 'border-radius': '50%' })
  })
})
