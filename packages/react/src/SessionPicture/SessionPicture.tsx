import { Terminal } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface SessionPictureProps {
  /** picture: the session's Pokémon · glyph: a terminal mark (work mode, or no Pokémon) · shell: a plain shell (>_) */
  kind: 'picture' | 'glyph' | 'shell'
  src?: string
  /** 18/20 tabs and compact rows · 22 headers · 24 rows · 26 the rail · 64/96 the chat's first screen */
  size: 18 | 20 | 22 | 24 | 26 | 64 | 96
  /** The session waits on you: it hops in place */
  hop?: boolean
  /** Said to screen readers (left out: decorative, the name is beside it) */
  label?: string
  className?: string
}

/** Who a session is, at a glance: its Pokémon, or a mark when there is none */
export function SessionPicture({ kind, src, size, hop, label, className }: SessionPictureProps) {
  const cls = ['sp-session-picture', `sp-session-picture--${kind}`]
  if (kind !== 'picture') cls.push(`sp-session-picture--${size}`)
  if (hop) cls.push('sp-session-picture--hop')
  if (className) cls.push(className)
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }
  const box = { width: size, height: size }
  if (kind === 'picture') return <img src={src} alt={label ?? ''} draggable={false} className={cls.join(' ')} style={box} />
  return (
    <span className={cls.join(' ')} style={box} {...a11y}>
      {kind === 'shell' ? '>_' : <Icon icon={Terminal} size={size >= 64 ? 16 : size >= 22 ? 14 : 12} />}
    </span>
  )
}
