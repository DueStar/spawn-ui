import { MagnifyingGlass } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface SearchFieldProps {
  /** Its name for screen readers */
  label: string
  value: string
  onChange(value: string): void
  /** 150 (the Pokédex's, the default) · 170 (the Box's, with its icon) · 120 (the swap list's) */
  width?: 120 | 150 | 170
  /** The magnifier at the right */
  icon?: boolean
  placeholder?: string
  className?: string
}

/** A search box over a list or a grid */
export function SearchField({ label, value, onChange, width = 150, icon, placeholder, className }: SearchFieldProps) {
  return (
    <span className={`sp-search sp-search--${width}${icon ? ' sp-search--icon' : ''}${className ? ` ${className}` : ''}`}>
      <input type="search" aria-label={label} className="sp-search__input sp-text-input" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
      {icon && <span className="sp-search__icon"><Icon icon={MagnifyingGlass} size={12} /></span>}
    </span>
  )
}
