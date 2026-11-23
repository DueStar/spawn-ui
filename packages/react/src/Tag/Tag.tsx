import type { Tier } from '@spawn-ui/tokens'
import React from 'react'

export interface TagProps {
  children: React.ReactNode
  /** A tier: its dot beside the word, the word in the tier's colour (never a filled chip) */
  tier?: Tier
  /** The whole text on hover (a string child is used when left out) */
  title?: string
  className?: string
}

/** A hairline label (spawn's 새로 등록, 색이 다른, a tier's word, 실행 중, a tool's name) */
export function Tag({ children, tier, title, className }: TagProps) {
  const t = title ?? (typeof children === 'string' ? children : undefined)
  return (
    <span className={`sp-tag${tier ? ` sp-tag--tier tier-${tier}` : ''}${className ? ` ${className}` : ''}`} title={t}>
      {tier && <i className="tdot" aria-hidden="true" />}
      <span className="sp-truncate">{children}</span>
    </span>
  )
}
