import React from 'react'

export interface MonCellProps {
  /** dex: the Pokédex's square · box: the Box (96) · box-icon: the Box's icon look · picker: choosing a Pokémon · partner: the ranking's partner */
  look: 'dex' | 'box' | 'box-icon' | 'picker' | 'partner'
  /** Its name for screen readers (an unknown one says so) */
  label: string
  /** A PokemonSprite */
  sprite?: React.ReactNode
  picked?: boolean
  /** Not met yet: a ? on the unknown grey */
  unknown?: boolean
  /** The number in the top-left corner */
  no?: string
  /** A mark in the bottom-left corner (shiny) */
  shiny?: React.ReactNode
  /** How many, bottom-right */
  count?: number
  /** Working on a session: a green dot */
  working?: boolean
  dragging?: boolean
  /** A word under the sprite (the picker) */
  caption?: React.ReactNode
  onClick?(): void
  onPointerDown?(e: React.PointerEvent<HTMLButtonElement>): void
  className?: string
}

/** A Pokémon's cell: the Pokédex, the Box, the pickers. Picked is the 1px yellow ring (or grey, as a partner). */
export function MonCell({ look, label, sprite, picked, unknown, no, shiny, count, working, dragging, caption, onClick, onPointerDown, className }: MonCellProps) {
  const cls = ['sp-mon-cell', `sp-mon-cell--${look}`]
  if (picked) cls.push('sp-mon-cell--picked')
  if (unknown) cls.push('sp-mon-cell--unknown')
  if (dragging) cls.push('sp-mon-cell--dragging')
  if (className) cls.push(className)
  return (
    <button type="button" aria-label={label} title={label} aria-pressed={picked ? true : undefined} className={cls.join(' ')} onClick={onClick} onPointerDown={onPointerDown}>
      {unknown ? <span className="sp-mon-cell__q" aria-hidden="true">?</span> : sprite}
      {caption && <span className="sp-mon-cell__caption">{caption}</span>}
      {no && <span className="sp-mon-cell__no" aria-hidden="true">{no}</span>}
      {shiny && <span className="sp-mon-cell__shiny" aria-hidden="true">{shiny}</span>}
      {count !== undefined && <span className="sp-mon-cell__count" aria-hidden="true">{count}</span>}
      {working && <i className="sp-mon-cell__working" aria-hidden="true" />}
    </button>
  )
}
