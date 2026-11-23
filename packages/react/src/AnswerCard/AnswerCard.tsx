import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { Radio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import React from 'react'
import { Card } from '../Card/Card'
import { TextInput } from '../TextInput/TextInput'

export interface AnswerCardProps {
  kind: 'permission' | 'question' | 'plan' | 'dialog'
  /** What it asks (its name) */
  title: React.ReactNode
  /** The kind in words, at the right (권한, 질문, 계획) */
  kindLabel: string
  children?: React.ReactNode
  /** Buttons: Button size="sm", the strong one solid */
  actions?: React.ReactNode
  /** A quiet word at the actions' end */
  hint?: React.ReactNode
  /** Answered: these words take the actions' place; the amber edge goes */
  answered?: React.ReactNode
  className?: string
}

/** A question Claude asks in the chat: permission, a question, a plan, a dialog. Amber while it waits; never yellow. */
export function AnswerCard({ kind, title, kindLabel, children, actions, hint, answered, className }: AnswerCardProps) {
  const id = React.useId()
  return (
    <Card pad="chat" attention={!answered} role="group" aria-labelledby={id} className={`sp-answer sp-answer--${kind}${className ? ` ${className}` : ''}`}>
      <div className="sp-answer__head">
        {!answered && <i className="sp-answer__dot" aria-hidden="true" />}
        <span id={id} className="sp-answer__title">{title}</span>
        <span className="sp-answer__kind">{kindLabel}</span>
      </div>
      {children}
      {answered
        ? <div className="sp-answer__actions"><span className="sp-answer__state">{answered}</span></div>
        : (actions || hint) && <div className="sp-answer__actions">{actions}{hint && <span className="sp-answer__hint">{hint}</span>}</div>}
    </Card>
  )
}

/** A permission's body: the command as written, facts about it, the rule that would allow it */
export function PermissionBody({ command, facts, rule, diff }: { command?: string; facts?: { text: React.ReactNode; warn?: boolean }[]; rule?: React.ReactNode; diff?: React.ReactNode }) {
  return <>
    {command && <pre className="sp-answer__cmd sp-exact">{command}</pre>}
    {diff}
    {facts?.map((f, i) => <div key={i} className={`sp-answer__fact${f.warn ? ' sp-answer__fact--warn' : ''}`}>{f.warn && <i className="sp-answer__dot" aria-hidden="true" />}<span>{f.text}</span></div>)}
    {rule && <div className="sp-answer__rule">{rule}</div>}
  </>
}

export interface QuestionOption { value: string; label: React.ReactNode; description?: React.ReactNode; preview?: React.ReactNode }

/** A question's options: one choice (radios) or several (checkboxes), and a written answer */
export function QuestionBody({ label, options, multi, value, onChange, other }: {
  label: string
  options: QuestionOption[]
  multi?: boolean
  value: string[]
  onChange(value: string[]): void
  /** A row for a written answer */
  other?: { label: string; value: string; onChange(v: string): void; placeholder?: string }
}) {
  const body = (o: QuestionOption) => <span className="sp-answer__opttext"><span className="sp-answer__optlabel">{o.label}</span>{o.description && <span className="sp-answer__optdesc">{o.description}</span>}{o.preview && <span className="sp-answer__optpre">{o.preview}</span>}</span>
  return (
    <div className="sp-answer__opts">
      {multi
        ? <div role="group" aria-label={label} className="sp-answer__optgroup">
            {options.map(o => (
              <label key={o.value} className="sp-answer__opt">
                <BaseCheckbox.Root className="sp-mark sp-mark--box" checked={value.includes(o.value)} onCheckedChange={on => onChange(on ? [...value, o.value] : value.filter(v => v !== o.value))} />
                {body(o)}
              </label>
            ))}
          </div>
        : <BaseRadioGroup aria-label={label} value={value[0] ?? ''} onValueChange={v => onChange([String(v)])} className="sp-answer__optgroup">
            {options.map(o => (
              <label key={o.value} className="sp-answer__opt">
                <Radio.Root className="sp-mark" value={o.value} />
                {body(o)}
              </label>
            ))}
          </BaseRadioGroup>}
      {other && <TextInput look="card" label={other.label} placeholder={other.placeholder ?? other.label} value={other.value} onChange={e => other.onChange(e.target.value)} />}
    </div>
  )
}

/** A plan: in a box of its own scroll */
export function PlanBody({ children }: { children: React.ReactNode }) {
  return <div className="sp-answer__plan sp-scroll--8">{children}</div>
}
