/** Dialog and PortalProvider (plan 2, Task 5). Values: docs/inventory.md §2.4 Dialog, §4 Dialogs */
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Dialog, PortalProvider } from '../src'
import { css, rule } from './css'

function Harness({ onClose = () => {}, kind }: { onClose?(): void; kind?: 'picker' | 'settings' | 'full' | 'lightbox' | 'popover' }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}>열기</button>
      <Dialog open={open} kind={kind} title="세션 이어하기" onClose={() => { onClose(); setOpen(false) }} closeLabel="닫기">
        <button>첫째</button>
        <button>둘째</button>
      </Dialog>
    </>
  )
}

describe('Dialog', () => {
  const c = () => css('Dialog', 'dialog.css')
  it('open: a dialog named by its title', async () => {
    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: '열기' }))
    expect(await screen.findByRole('dialog', { name: '세션 이어하기' })).toBeTruthy()
  })
  it('Esc and the close button call onClose once each', async () => {
    const off = vi.fn()
    const user = userEvent.setup()
    render(<Harness onClose={off} />)
    await user.click(screen.getByRole('button', { name: '열기' }))
    await screen.findByRole('dialog')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(off).toHaveBeenCalledTimes(1))
    await user.click(screen.getByRole('button', { name: '열기' }))
    await user.click(await screen.findByRole('button', { name: '닫기' }))
    await waitFor(() => expect(off).toHaveBeenCalledTimes(2))
  })
  it('a click on the backdrop closes it', async () => {
    const off = vi.fn()
    const user = userEvent.setup()
    render(<Harness onClose={off} />)
    await user.click(screen.getByRole('button', { name: '열기' }))
    await screen.findByRole('dialog')
    await user.click(document.querySelector('.sp-dialog__backdrop') as HTMLElement)
    await waitFor(() => expect(off).toHaveBeenCalledTimes(1))
  })
  it('Tab stays inside while open; closing gives the focus back to the opener', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const opener = screen.getByRole('button', { name: '열기' })
    await user.click(opener)
    const dlg = await screen.findByRole('dialog')
    // (Base UI's focus guards — spans with data-type — pass the focus back inside; never the page behind)
    for (let i = 0; i < 6; i++) { await user.tab(); const el = document.activeElement as HTMLElement; expect(dlg.contains(el) || el.hasAttribute('data-type'), `tab ${i}: ${el.outerHTML.slice(0, 60)}`).toBe(true); expect(el).not.toBe(opener) }
    await user.keyboard('{Escape}')
    await waitFor(() => expect(document.activeElement).toBe(opener))
  })
  it('inside a PortalProvider it renders in that container (so a preview\'s text size reaches it)', async () => {
    function P() {
      const [el, setEl] = useState<HTMLElement | null>(null)
      return <div className="sp-ts-130" ref={setEl}>{el && <PortalProvider container={el}><Dialog open title="t" onClose={() => {}}>x</Dialog></PortalProvider>}</div>
    }
    render(<P />)
    const dlg = await screen.findByRole('dialog')
    expect(dlg.closest('.sp-ts-130')).not.toBeNull()
  })
  it('hideTitle keeps the name for screen readers', async () => {
    render(<Dialog open title="사진" hideTitle kind="lightbox" onClose={() => {}}>x</Dialog>)
    expect(await screen.findByRole('dialog', { name: '사진' })).toBeTruthy()
  })
  it('picker (resume, we:284): backdrop rgba(6,7,10,.55); min(520px, 94vw), max 80vh; shadow 16/48 .5; head 11px 14px --t-name 600 over a hairline', () => {
    expect(rule(c(), '.sp-dialog--picker .sp-dialog__backdrop').background).toBe('rgba(6, 7, 10, 0.55)')
    expect(rule(c(), '.sp-dialog--picker .sp-dialog__popup')).toMatchObject({ width: 'min(520px, 94vw)', 'max-height': '80vh', 'box-shadow': '0 16px 48px rgba(0, 0, 0, 0.5)' })
    expect(rule(c(), '.sp-dialog__head')).toMatchObject({ padding: '11px 14px', 'font-size': 'var(--t-name)', 'font-weight': 'var(--w-head)', 'border-bottom': '1px solid var(--line)' })
  })
  it('settings (we:511): backdrop .6 with 16px around (6 below 560px); min(760px,100%) × min(560px,100%)', () => {
    expect(rule(c(), '.sp-dialog--settings .sp-dialog__backdrop').background).toBe('rgba(6, 7, 10, 0.6)')
    expect(c()).toMatch(/\.sp-dialog--settings \.sp-dialog__viewport \{[^}]*padding: 16px/)
    expect(c()).toMatch(/@media \(max-width: 560px\) \{[\s\S]*?\.sp-dialog--settings \.sp-dialog__viewport \{ padding: 6px; \}/)
    expect(rule(c(), '.sp-dialog--settings .sp-dialog__popup')).toMatchObject({ width: 'min(760px, 100%)', height: 'min(560px, 100%)' })
  })
  it('full (ch:602): black .55 backdrop, padding 24, --read-w wide, shadow 12/36; head 8px 10px 8px 16px', () => {
    expect(rule(c(), '.sp-dialog--full .sp-dialog__backdrop').background).toBe('rgba(0, 0, 0, 0.55)')
    expect(rule(c(), '.sp-dialog--full .sp-dialog__popup')).toMatchObject({ 'max-width': 'var(--read-w)', 'box-shadow': '0 12px 36px rgba(0, 0, 0, 0.5)' })
    expect(rule(c(), '.sp-dialog--full .sp-dialog__head').padding).toBe('8px 10px 8px 16px')
  })
  it('lightbox (ch:322): backdrop .86, no panel; popover (fb-pop): 340 wide, a 10 % white border, shadow 18/48 .55', () => {
    expect(rule(c(), '.sp-dialog--lightbox .sp-dialog__backdrop').background).toBe('rgba(6, 7, 10, 0.86)')
    expect(rule(c(), '.sp-dialog--lightbox .sp-dialog__popup')).toMatchObject({ background: 'none', border: '0', 'box-shadow': 'none' })
    expect(rule(c(), '.sp-dialog--popover .sp-dialog__popup')).toMatchObject({ width: '340px', border: '1px solid rgba(255, 255, 255, 0.1)', 'box-shadow': '0 18px 48px rgba(0, 0, 0, 0.55)' })
  })
  it('a panel: --card, a --line hairline, --r-l', () => {
    expect(rule(c(), '.sp-dialog__popup')).toMatchObject({ background: 'var(--card)', border: '1px solid var(--line)', 'border-radius': 'var(--r-l)' })
  })
})
