/** Plan 4, Task 5: AnswerCard + PermissionBody, QuestionBody, PlanBody. Values: chat.css 360–416 */
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AnswerCard, Button, PermissionBody, PlanBody, QuestionBody } from '../src'
import { css, rule } from './css'

const c = () => css('AnswerCard', 'answer-card.css')

describe('AnswerCard', () => {
  it('a group named by what it asks, on the chat card with the amber edge; the kind at the right', () => {
    render(<AnswerCard kind="permission" title="명령 실행" kindLabel="권한" actions={<Button>허용</Button>}>x</AnswerCard>)
    const g = screen.getByRole('group', { name: '명령 실행' })
    expect(g.className).toContain('sp-card--attention')
    expect(g.className).toContain('sp-card--pad-chat')
    expect(screen.getByText('권한').className).toBe('sp-answer__kind')
    expect(rule(c(), '.sp-answer__head')).toMatchObject({ 'font-size': 'var(--t-ui)', 'font-weight': 'var(--w-name)', color: 'var(--ink)' })
    expect(rule(c(), '.sp-answer__kind')).toMatchObject({ 'margin-left': 'auto', 'font-size': 'var(--t-meta)', color: 'var(--ink-3)' })
    expect(rule(c(), '.sp-answer__actions')).toMatchObject({ gap: '6px', 'min-height': '28px' })
  })
  it('answered: its words in place of the actions, and no amber edge', () => {
    render(<AnswerCard kind="question" title="q" kindLabel="질문" actions={<Button>보내기</Button>} answered="A를 골랐어요">x</AnswerCard>)
    expect(screen.queryByRole('button', { name: '보내기' })).toBeNull()
    expect(screen.getByText('A를 골랐어요').className).toBe('sp-answer__state')
    expect(screen.getByRole('group').className).not.toContain('sp-card--attention')
  })
})

describe('PermissionBody', () => {
  it('the command in a well (max 160, its own scroll), facts (warn in --ink with the amber dot), the rule', () => {
    render(<PermissionBody command="rm -rf build" facts={[{ text: '샌드박스 밖에서 실행해요', warn: true }]} rule={<>규칙: <code>Bash(rm:*)</code></>} />)
    expect(screen.getByText('rm -rf build').className).toContain('sp-answer__cmd')
    expect(document.querySelector('.sp-answer__fact--warn .sp-answer__dot')).not.toBeNull()
    expect(rule(c(), '.sp-answer__cmd')).toMatchObject({ 'max-height': '160px', overflow: 'auto', background: 'var(--term-bg)', 'font-size': 'var(--t-code)' })
    expect(rule(c(), '.sp-answer__fact--warn')).toMatchObject({ color: 'var(--ink)', 'font-weight': 'var(--w-name)' })
  })
})

describe('QuestionBody', () => {
  function Q({ multi }: { multi?: boolean }) {
    const [v, setV] = useState<string[]>([])
    return <QuestionBody label="방식 고르기" multi={multi} value={v} onChange={setV} options={[{ value: 'a', label: 'A안', description: '빠르게' }, { value: 'b', label: 'B안' }]} other={{ label: '직접 입력', value: '', onChange: () => {} }} />
  }
  it('one choice: a named radio group; arrows move and choose', async () => {
    const user = userEvent.setup()
    render(<Q />)
    expect(screen.getByRole('radiogroup', { name: '방식 고르기' })).toBeTruthy()
    const a = screen.getByRole('radio', { name: /A안/ })
    await user.click(a)
    expect(a.getAttribute('aria-checked')).toBe('true')
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('radio', { name: /B안/ }).getAttribute('aria-checked')).toBe('true')
  })
  it('several: checkboxes, Space toggles', async () => {
    const user = userEvent.setup()
    render(<Q multi />)
    const a = screen.getByRole('checkbox', { name: /A안/ })
    a.focus(); await user.keyboard(' ')
    expect(a.getAttribute('aria-checked')).toBe('true')
  })
  it('an option\'s description under its label; the other row is a card field named by its label', () => {
    render(<Q />)
    expect(screen.getByText('빠르게').className).toBe('sp-answer__optdesc')
    expect(screen.getByRole('textbox', { name: '직접 입력' }).className).toContain('sp-text-input--card')
    expect(rule(c(), '.sp-answer__opt')).toMatchObject({ 'min-height': '30px', padding: '5px 12px' })
  })
})

describe('PlanBody', () => {
  it('its own scroll past 320', () => {
    render(<PlanBody>계획</PlanBody>)
    expect(rule(c(), '.sp-answer__plan')).toMatchObject({ 'max-height': '320px', overflow: 'auto' })
  })
})
