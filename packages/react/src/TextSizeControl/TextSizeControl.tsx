import React from 'react'
import { Menu } from '../Menu/Menu'

export interface TextSizeControlProps {
  /** The step in use */
  step: number
  steps: { value: number; label: string }[]
  onStep(value: number): void
  /** A narrow bar: one 가 button opening the steps */
  compact?: boolean
  labels: { smaller: string; larger: string; menu: string }
}

/** − 가 + : the app's one text size (80–130 %) */
export function TextSizeControl({ step, steps, onStep, compact, labels }: TextSizeControlProps) {
  const i = Math.max(0, steps.findIndex(s => s.value === step))
  const cur = steps[i]
  const menu = <Menu trigger={<button type="button" className="sp-textsize__cur" aria-label={`${labels.menu}: ${cur?.label ?? ''}`}><span className="sp-textsize__g" aria-hidden="true">가</span>{!compact && <span>{cur?.label}</span>}</button>}
    label={labels.menu} title={labels.menu} items={steps.map(s => ({ value: String(s.value), label: s.label, checked: s.value === step }))} onSelect={v => onStep(Number(v))} width={140} />
  return (
    <div className={`sp-textsize${compact ? ' sp-textsize--compact' : ''}`}>
      {!compact && <button type="button" className="sp-textsize__step" aria-label={labels.smaller} title={labels.smaller} disabled={i <= 0} onClick={() => onStep(steps[i - 1].value)}>−</button>}
      {menu}
      {!compact && <button type="button" className="sp-textsize__step" aria-label={labels.larger} title={labels.larger} disabled={i >= steps.length - 1} onClick={() => onStep(steps[i + 1].value)}>+</button>}
    </div>
  )
}
