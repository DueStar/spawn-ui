import { Radio } from '@base-ui/react/radio'
import { RadioGroup as Base } from '@base-ui/react/radio-group'
import React from 'react'

export interface RadioGroupProps<T extends string> {
  /** The group's name for screen readers */
  label: string
  value: T
  onValueChange(value: T): void
  options: { value: T; label: React.ReactNode; disabled?: boolean }[]
  className?: string
}

/** One out of a list (a question's options) */
export function RadioGroup<T extends string>({ label, value, onValueChange, options, className }: RadioGroupProps<T>) {
  return (
    <Base aria-label={label} value={value} onValueChange={v => onValueChange(v as T)} className={`sp-radio-group${className ? ` ${className}` : ''}`}>
      {options.map(o => (
        <label key={o.value} className={`sp-choice${o.disabled ? ' is-disabled' : ''}`}>
          <Radio.Root className="sp-mark" value={o.value} disabled={o.disabled} />
          <span className="sp-choice__label">{o.label}</span>
        </label>
      ))}
    </Base>
  )
}
