import React from 'react'

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** hero: a whole page (the chat's first screen) · pane: fills its pane · inline: a row in a list or grid */
  size: 'hero' | 'pane' | 'inline'
  /** A picture or a large glyph above the words */
  picture?: React.ReactNode
  title?: React.ReactNode
  hint?: React.ReactNode
  /** Buttons under the words */
  actions?: React.ReactNode
  /** Still loading: said politely to screen readers */
  loading?: boolean
}

/** What a place shows while it has nothing yet (or is loading it) */
export function EmptyState({ size, picture, title, hint, actions, loading, className, ...rest }: EmptyStateProps) {
  return (
    <div className={`sp-empty sp-empty--${size}${className ? ` ${className}` : ''}`} role={loading ? 'status' : undefined} aria-live={loading ? 'polite' : undefined} {...rest}>
      {picture && <div className="sp-empty__picture">{picture}</div>}
      {title && <div className="sp-empty__title">{title}</div>}
      {hint && <div className="sp-empty__hint">{hint}</div>}
      {actions && <div className="sp-empty__actions">{actions}</div>}
    </div>
  )
}
