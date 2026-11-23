/** Plan 3, Task 8: WildRow, CatchToast, LeaderboardRow, LogRow, StepCount, DexDetailCard, PatchNotes. Values: chat-game.css 9–38; toast.css 27–110; pokedex.css 200–232, 388–420, 535–552; widget-expanded.css 465–486 */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CatchToast, DexDetailCard, LeaderboardRow, LogDay, LogRow, PatchNotes, StepCount, WildRow } from '../src'
import { css, rule } from './css'

describe('WildRow', () => {
  const c = () => css('WildRow', 'wild-row.css')
  it('the one pixelated sprite in the package; the result in words; quiet at .72', () => {
    render(<WildRow sprite="/p/25.png" name="피카츄" result="caught" resultLabel="잡았어요" tier="rare" tierLabel="희귀" />)
    expect(document.querySelector('img')!.className).toContain('sp-sprite--pixelated')
    expect(screen.getByText('잡았어요')).toBeTruthy()
    expect(screen.getByText('희귀')).toBeTruthy()
    expect(rule(c(), '.sp-wild')).toMatchObject({ 'min-height': '34px', padding: '4px 12px 4px 6px', border: '1px solid var(--line)', 'border-radius': 'var(--r-m)', background: 'rgba(255, 255, 255, 0.015)', opacity: '0.72' })
  })
  it('appear: the picture comes in once (.5s), still under reduced motion', () => {
    render(<WildRow sprite="x" name="n" result="fled" resultLabel="도망쳤어요" appear />)
    expect(document.querySelector('.sp-wild')?.className).toContain('sp-wild--appear')
    expect(rule(c(), '.sp-wild--appear .sp-sprite').animation).toBe('sp-wild-in .5s cubic-bezier(.2, .8, .2, 1) both')
  })
})

describe('CatchToast', () => {
  const c = () => css('CatchToast', 'catch-toast.css')
  it('a status card: art 64 with the sprite 48, the eyebrow, the title, its close named', () => {
    const off = vi.fn()
    render(<CatchToast kind="catch" sprite="/p/25.png" eyebrow="잡았어요" title="피카츄" tier="rare" tierLabel="희귀" onClose={off} closeLabel="알림 닫기" />)
    expect(screen.getByRole('status')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '알림 닫기' })); expect(off).toHaveBeenCalledTimes(1)
    expect(rule(c(), '.sp-toast')).toMatchObject({ 'grid-template-columns': '64px minmax(0, 1fr)', gap: '14px', padding: '14px 18px 14px 14px', 'border-radius': 'var(--r-toast)', background: 'var(--toast-bg)', animation: 'sp-toast-in 0.3s cubic-bezier(.2, .8, .2, 1) both' })
    expect(rule(c(), '.sp-toast__art')).toMatchObject({ width: '64px', height: '64px', 'border-radius': 'var(--r-l)', background: 'var(--toast-art-bg)' })
  })
  it('the title is the toast\'s fixed 15px 600 (the toast never takes the text step)', () => {
    expect(rule(c(), '.sp-toast__title')).toMatchObject({ 'font-size': '15px', 'font-weight': 'var(--w-head)' })
  })
  it('the border by tier: rare 35 %, sub 50 %, legendary and mythical a ring; shiny; flee is a silhouette', () => {
    render(<CatchToast kind="flee" sprite="x" eyebrow="도망쳤어요" title="n" />)
    expect(document.querySelector('.sp-toast img')?.className).toContain('sp-silhouette')
    expect(rule(c(), '.sp-toast--catch.tier-rare')['border-color']).toBe('color-mix(in srgb, var(--tier) 35%, transparent)')
    expect(rule(c(), '.sp-toast--catch.tier-sub')['border-color']).toBe('color-mix(in srgb, var(--tier) 50%, transparent)')
    expect(rule(c(), '.sp-toast--catch.tier-legendary')['box-shadow']).toBe('0 0 0 1px var(--tier)')
    expect(rule(c(), '.sp-toast--shiny')['border-color']).toBe('var(--shiny)')
  })
})

describe('LeaderboardRow', () => {
  const c = () => css('LeaderboardRow', 'leaderboard-row.css')
  it('grid 36 30 1fr auto, 6px 10px; the name --t-name 500; me: --sel-bg and the 나 tag in words', () => {
    render(<LeaderboardRow place={12} name="Duestar" value="185" unit="종" me meLabel="나" />)
    expect(screen.getByText('나').className).toBe('sp-rank__me')
    expect(document.querySelector('.sp-rank')?.className).toContain('sp-rank--me')
    expect(rule(c(), '.sp-rank')).toMatchObject({ 'grid-template-columns': '36px 30px minmax(0, 1fr) auto', gap: '10px', padding: '6px 10px', 'border-radius': 'var(--r-s)' })
    expect(rule(c(), '.sp-rank--me').background).toBe('var(--sel-bg)')
    expect(rule(c(), '.sp-rank__me')).toMatchObject({ border: '1px solid rgba(255, 255, 255, 0.18)', 'font-size': 'var(--t-micro)' })
  })
  it('top three: 8px 10px, the place on a metal disc (22, round)', () => {
    render(<LeaderboardRow place={1} name="a" value="1" />)
    expect(document.querySelector('.sp-rank')?.className).toContain('sp-rank--top1')
    expect(rule(c(), '.sp-rank--top').padding).toBe('8px 10px')
    expect(rule(c(), '.sp-rank--top .sp-rank__place')).toMatchObject({ width: '22px', height: '22px', 'border-radius': '50%', background: 'var(--metal)' })
    expect(rule(c(), '.sp-rank--top1')['--metal']).toBe('var(--metal-1)')
  })
})

describe('LogRow and LogDay', () => {
  it('a row: min 60, 12px 0, gap 12; the time 5.6em; the icon 32; the line --t-name', () => {
    render(<><LogDay label="오늘" /><LogRow time="오후 2:12" icon={<img alt="" />} text={<b>피카츄</b>} sub="희귀" /></>)
    const c = css('LogRow', 'log-row.css')
    expect(rule(c, '.sp-log-row')).toMatchObject({ 'min-height': '60px', padding: '12px 0', gap: '12px' })
    expect(rule(c, '.sp-log-row__time').width).toBe('5.6em')
    expect(rule(c, '.sp-log-row__icon > *')).toMatchObject({ width: '32px', height: '32px' })
    expect(rule(c, '.sp-log-day')).toMatchObject({ position: 'sticky', top: '-6px', background: 'var(--bg)' })
    expect(screen.getByRole('heading', { name: '오늘' })).toBeTruthy()
  })
})

describe('StepCount', () => {
  it('a paw and the steps, named for screen readers', () => {
    render(<StepCount steps={8} label="8걸음" />)
    expect(screen.getByLabelText('8걸음').textContent).toContain('8')
    expect(rule(css('StepCount', 'step-count.css'), '.sp-steps')).toMatchObject({ display: 'inline-flex', gap: '4px' })
  })
})

describe('DexDetailCard', () => {
  it('art 160 tall on --mon-bg; the name at its fixed 16px; facts in an 84px / 1fr list with hairlines; flavor line-height 1.7', () => {
    render(<DexDetailCard art={<img alt="" />} name="피카츄" no="#0025" facts={[{ label: '키', value: '0.4m' }]} flavor="볼에 전기 주머니가 있어요" />)
    expect(screen.getByRole('heading', { name: '피카츄' })).toBeTruthy()
    expect(screen.getByText('키').tagName).toBe('DT')
    const c = css('DexDetailCard', 'dex-detail-card.css')
    expect(rule(c, '.sp-dex-card__art')).toMatchObject({ height: '160px', 'border-radius': 'var(--r-l)', background: 'var(--mon-bg)' })
    expect(rule(c, '.sp-dex-card__name')).toMatchObject({ 'font-size': '16px', 'font-weight': 'var(--w-head)' })
    expect(rule(c, '.sp-dex-card__facts')['grid-template-columns']).toBe('84px minmax(0, 1fr)')
    expect(rule(c, '.sp-dex-card__flavor')['line-height']).toBe('1.7')
  })
})

describe('PatchNotes', () => {
  it('a dialog of releases that open and close; the chevron turns (.15s); the foot is one solid button', async () => {
    const off = vi.fn()
    render(<PatchNotes open title="새로워진 점" okLabel="확인" onClose={off} releases={[{ version: '1.10.14', items: ['칸 추가'] }, { version: '1.10.13', items: ['탭 유지'] }]} />)
    expect(await screen.findByRole('dialog', { name: '새로워진 점' })).toBeTruthy()
    expect(document.querySelectorAll('details').length).toBe(2)
    expect((document.querySelector('details') as HTMLDetailsElement).open).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: '확인' })); expect(off).toHaveBeenCalled()
    const c = css('PatchNotes', 'patch-notes.css')
    expect(rule(c, '.sp-notes__group > summary::before')).toMatchObject({ content: "'›'", transition: 'transform .15s' })
    expect(rule(c, '.sp-notes__body')).toMatchObject({ padding: '4px 16px 8px', 'line-height': '1.55', 'font-size': 'var(--t-name)' })
    expect(rule(c, '.sp-notes__ok')).toMatchObject({ height: '36px', 'border-radius': 'var(--r-l)', background: 'var(--ink)' })
  })
})
