import React from 'react'

export interface DexStripProps {
  /** 도감 */
  label: string
  count: number
  total: number
  /** The latest catches (PokemonSprites), newest first; the oldest fold away when there is no room */
  recent: { key: string; sprite: React.ReactNode }[]
  isNew?: boolean
  /** The new dot's words */
  newLabel?: string
  onOpen(): void
  className?: string
}

/** The side panel's Pokédex line: how many caught, and the latest */
export function DexStrip({ label, count, total, recent, isNew, newLabel, onOpen, className }: DexStripProps) {
  const name = `${label} ${count} / ${total}${isNew && newLabel ? ` · ${newLabel}` : ''}`
  return (
    <button type="button" className={`sp-dex-strip${className ? ` ${className}` : ''}`} aria-label={name} onClick={onOpen}>
      <span className="sp-dex-strip__label">{label}{isNew && <i className="sp-dex-strip__new" aria-hidden="true" />}</span>
      <span className="sp-dex-strip__count"><b>{count}</b> / {total}</span>
      <span className="sp-dex-strip__recent" aria-hidden="true">{recent.map(r => <React.Fragment key={r.key}>{r.sprite}</React.Fragment>)}</span>
    </button>
  )
}
