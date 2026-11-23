/** Plan 4, Task 1: Prose, CodeBlock, MdDoc. Values: chat.css 9–28, 54–70, 558–569 */
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { CodeBlock, MdDoc, Prose } from '../src'
import { css, rule } from './css'

describe('Prose', () => {
  const c = () => css('Prose', 'prose.css')
  it('styles the app\'s rendered Markdown: --t-prose lh 1.7; headings 600; inline code; quotes; tables', () => {
    render(<Prose><h2>제목</h2><p>본문 <code>npm test</code></p></Prose>)
    expect(document.querySelector('.sp-prose h2')?.textContent).toBe('제목')
    expect(rule(c(), '.sp-prose')).toMatchObject({ 'font-size': 'var(--t-prose)', 'line-height': '1.7', color: 'var(--ink)' })
    expect(rule(c(), '.sp-prose h1')).toMatchObject({ 'font-size': 'var(--t-head)', 'font-weight': '600' })
    expect(rule(c(), '.sp-prose code')).toMatchObject({ 'font-size': 'calc(var(--t-prose) - 1px)', padding: '1px 5px', 'border-radius': 'var(--r-xs)' })
    expect(rule(c(), '.sp-prose blockquote')['border-left']).toBe('1px solid var(--line-hover)')
    expect(rule(c(), '.sp-prose th')).toMatchObject({ 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
  })
})

describe('CodeBlock', () => {
  const c = () => css('CodeBlock', 'code-block.css')
  it('a well: the language in mono --t-meta, copy named; pre 10px 12px --t-code lh 1.6', () => {
    const cp = vi.fn()
    render(<CodeBlock lang="ts" code="const a = 1" onCopy={cp} copyLabel="복사" />)
    expect(screen.getByText('const a = 1').tagName).toBe('CODE')
    fireEvent.click(screen.getByRole('button', { name: '복사' })); expect(cp).toHaveBeenCalledTimes(1)
    expect(rule(c(), '.sp-code')).toMatchObject({ background: 'var(--term-bg)', 'border-radius': 'var(--r-m)', border: '1px solid var(--line)' })
    expect(rule(c(), '.sp-code__head')).toMatchObject({ 'min-height': '30px', padding: '3px 4px 3px 12px' })
    expect(rule(c(), '.sp-code pre')).toMatchObject({ padding: '10px 12px', 'font-size': 'var(--t-code)', 'line-height': '1.6' })
  })
})

describe('MdDoc', () => {
  const c = () => css('MdDoc', 'md-doc.css')
  it('a document with a 문서 / 원문 switch; folded at 420 with a mask', () => {
    const v = vi.fn()
    render(<MdDoc title="PLAN.md" view="doc" onView={v} folded labels={{ group: '보기', doc: '문서', raw: '원문' }}>본문</MdDoc>)
    fireEvent.click(screen.getByRole('button', { name: '원문' })); expect(v).toHaveBeenCalledWith('raw')
    expect(document.querySelector('.sp-mddoc__body')?.className).toContain('sp-mddoc__body--folded')
    expect(rule(c(), '.sp-mddoc')).toMatchObject({ background: 'var(--card)', 'border-radius': 'var(--r-m)' })
    expect(rule(c(), '.sp-mddoc__body').padding).toBe('14px 18px 12px')
    expect(rule(c(), '.sp-mddoc__body--folded')['max-height']).toBe('420px')
  })
})
