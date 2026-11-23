import { Checkbox as Base } from '@base-ui/react/checkbox'
import React from 'react'

export interface CheckboxProps {
  /** Shown beside the mark and said to screen readers */
  label: React.ReactNode
  checked: boolean
  onCheckedChange(checked: boolean): void
  disabled?: boolean
  className?: string
}

/** One of several that may all be chosen (a question's multi-select) */
export function Checkbox({ label, checked, onCheckedChange, disabled, className }: CheckboxProps) {
  return (
    <label className={`sp-choice${disabled ? ' is-disabled' : ''}${className ? ` ${className}` : ''}`}>
      <Base.Root className="sp-mark sp-mark--box" checked={checked} disabled={disabled} onCheckedChange={v => onCheckedChange(v)} />
      <span className="sp-choice__label">{label}</span>
    </label>
  )
}
