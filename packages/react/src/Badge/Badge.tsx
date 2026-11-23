import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  /** new: a word (NEW) · count: a number */
  tone: 'new' | 'count'
  className?: string
}

/** A reward's badge on the reward yellow (spawn's toast .w-toast-new / .w-toast-badge): the one round pill */
export function Badge({ children, tone, className }: BadgeProps) {
  return <span className={`sp-badge sp-badge--${tone}${className ? ` ${className}` : ''}`}>{children}</span>
}
