import { X } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface ImageChipProps {
  src?: string
  name: string
  /** chip: attached in the composer · thumb: a picture over a sent message or in an answer · text: a name only */
  look: 'chip' | 'thumb' | 'text'
  onOpen?(): void
  openLabel?: string
  onRemove?(): void
  removeLabel?: string
  className?: string
}

/** A picture: a small chip in the composer, a thumbnail in the conversation (a click shows it large) */
export function ImageChip({ src, name, look, onOpen, openLabel, onRemove, removeLabel = 'Remove', className }: ImageChipProps) {
  if (look === 'text') return <span className={`sp-ichip-text${className ? ` ${className}` : ''}`}>{name}</span>
  if (look === 'thumb') return <button type="button" className={`sp-ithumb${className ? ` ${className}` : ''}`} aria-label={openLabel ? `${openLabel}: ${name}` : name} onClick={onOpen}><img src={src} alt="" /></button>
  return (
    <span className={`sp-ichip${className ? ` ${className}` : ''}`}>
      <button type="button" className="sp-ichip__pic" aria-label={openLabel ? `${openLabel}: ${name}` : name} onClick={onOpen}><img src={src} alt="" /></button>
      <span className="sp-ichip__name" title={name}>{name}</span>
      {onRemove && <button type="button" className="sp-ichip__x" aria-label={removeLabel} title={removeLabel} onClick={onRemove}><Icon icon={X} size={12} /></button>}
    </span>
  )
}
