import React from 'react'
import { SegmentedControl } from '../SegmentedControl/SegmentedControl'

export interface ListHeadProps {
  mode: 'compact' | 'detail'
  onMode(mode: 'compact' | 'detail'): void
  labels: { compact: string; detail: string; group: string }
  /** At the right: a new shell, a new session */
  actions?: React.ReactNode
  className?: string
}

/** The session list's head: 간략 / 상세 first, its buttons at the right (spawn 1.10.14: no count) */
export function ListHead({ mode, onMode, labels, actions, className }: ListHeadProps) {
  return (
    <div className={`sp-list-head${className ? ` ${className}` : ''}`}>
      <SegmentedControl size="xs" label={labels.group} value={mode} onChange={onMode} options={[{ value: 'compact', label: labels.compact }, { value: 'detail', label: labels.detail }]} />
      {actions && <span className="sp-list-head__actions">{actions}</span>}
    </div>
  )
}
