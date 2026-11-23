import { File, X } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface FileChipProps {
  path: string
  /** prose: a file named in an answer · inline: in a sent message · pill: the files a message carried · draft: attached in the composer */
  look: 'prose' | 'inline' | 'pill' | 'draft'
  onOpen?(): void
  onRemove?(): void
  removeLabel?: string
  className?: string
}

const nameOf = (p: string) => p.split(/[\\/]/).filter(Boolean).pop() ?? p

/** A file as a quiet chip; a click opens it. The name shows; the whole path is its title */
export function FileChip({ path, look, onOpen, onRemove, removeLabel = 'Remove', className }: FileChipProps) {
  const name = look === 'prose' || look === 'inline' ? path : nameOf(path)
  const body = <span className="sp-fchip__in"><Icon icon={File} size={12} /><span className="sp-fchip__name">{name}</span></span>
  const cls = `sp-fchip sp-fchip--${look}${className ? ` ${className}` : ''}`
  return (
    <span className={cls}>
      {onOpen ? <button type="button" className="sp-fchip__open" title={path} onClick={onOpen}>{body}</button> : <span className="sp-fchip__open" title={path}>{body}</span>}
      {onRemove && <button type="button" className="sp-fchip__x" aria-label={removeLabel} title={removeLabel} onClick={onRemove}><Icon icon={X} size={12} /></button>}
    </span>
  )
}
