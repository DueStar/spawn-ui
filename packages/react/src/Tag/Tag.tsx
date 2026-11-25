import type { Tier } from '@spawn-ui/tokens'
import React from 'react'

export interface TagProps {
  children: React.ReactNode
  /** A tier: its dot beside the word, the word in the tier's colour (never a filled chip) */
  tier?: Tier
  /** plain: the wild row's tag (the default) · badge: a hairline in --ink-2 at the size of its line (the resume list) · run: amber (실행 중) */
  tone?: 'plain' | 'badge' | 'run'
  /** The whole text on hover (a string child is used when left out) */
  title?: string
  /** The word drawn whole, never cut to …: for a short fixed word that must not lose an edge pixel (spawn's 이어하기 badges) */
  whole?: boolean
  className?: string
}

/** A hairline label (spawn's 새로 등록, 색이 다른, a tier's word, 실행 중, a tool's name) */
export function Tag({ children, tier, tone = 'plain', title, whole, className }: TagProps) {
  const t = title ?? (typeof children === 'string' ? children : undefined)
  return (
    <span className={`sp-tag${tier ? ` sp-tag--tier tier-${tier}` : tone !== 'plain' ? ` sp-tag--${tone}` : ''}${className ? ` ${className}` : ''}`} title={t}>
      {tier && <i className="tdot" aria-hidden="true" />}
      {whole ? children : <span className="sp-truncate">{children}</span>}
    </span>
  )
}
