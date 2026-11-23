import { Switch as Base } from '@base-ui/react/switch'
import React from 'react'

export interface SwitchProps {
  /** Its name for screen readers (the setting it turns on) */
  label: string
  checked: boolean
  onCheckedChange(checked: boolean): void
  disabled?: boolean
  className?: string
}

/** On or off, at once (spawn's settings). On is yellow: a setting turned on is a chosen thing. */
export function Switch({ label, checked, onCheckedChange, disabled, className }: SwitchProps) {
  return (
    <Base.Root aria-label={label} checked={checked} disabled={disabled} onCheckedChange={v => onCheckedChange(v)} className={`sp-switch${className ? ` ${className}` : ''}`}>
      <Base.Thumb className="sp-switch__knob" />
    </Base.Root>
  )
}
