import { X } from '@phosphor-icons/react'
import React from 'react'
import { Button } from '../Button/Button'
import { IconButton } from '../IconButton/IconButton'

export interface NoticeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode
  /** plain (the default) · warn: amber · ok: green */
  tone?: 'plain' | 'warn' | 'ok'
  /** meta (the default, the small line) · ui */
  size?: 'meta' | 'ui'
  /** The grey: 3 (the default, quiet) · 2 */
  ink?: 2 | 3
  align?: 'start' | 'center'
  /** In a hairline box, entering softly (the widget's note) */
  boxed?: boolean
  /** A centered word between the days of a conversation */
  divider?: boolean
  /** One link button after the words */
  action?: { label: string; onClick(): void }
  /** Shows a × that calls this */
  onDismiss?(): void
  /** The ×'s name for screen readers */
  dismissLabel?: string
}

/** A quiet line: a status, a hint, a day, a warning. It wraps; it never hides its words. */
export function Notice({ children, tone = 'plain', size = 'meta', ink = 3, align = 'start', boxed, divider, action, onDismiss, dismissLabel = 'Dismiss', className, ...rest }: NoticeProps) {
  const cls = ['sp-notice', `sp-notice--${size}`, `sp-notice--ink-${ink}`]
  if (tone !== 'plain') cls.push(`sp-notice--${tone}`)
  if (align === 'center') cls.push('sp-notice--center')
  if (boxed) cls.push('sp-notice--boxed')
  if (divider) cls.push('sp-notice--divider')
  if (className) cls.push(className)
  return (
    <div className={cls.join(' ')} {...rest}>
      <span className="sp-notice__text">{children}</span>
      {action && <Button variant="link" onClick={action.onClick}>{action.label}</Button>}
      {onDismiss && <IconButton size="xs" icon={X} label={dismissLabel} onClick={onDismiss} />}
    </div>
  )
}
