import React from 'react'

export interface Suggestion { value: string; label: React.ReactNode; desc?: React.ReactNode; kind?: React.ReactNode }

export interface SuggestionListProps {
  /** For the field's aria-controls / aria-activedescendant (`${id}-${index}`) */
  id: string
  label: string
  title?: React.ReactNode
  items: Suggestion[]
  /** The option the field's ↑ ↓ have reached */
  active: number
  onPick(value: string): void
  /** 300 (mentions) · 460 (commands) */
  width?: 300 | 460
  empty?: React.ReactNode
}

/** The mentions and commands the composer's field offers: a listbox the field drives (it keeps the focus) */
export function SuggestionList({ id, label, title, items, active, onPick, width = 300, empty }: SuggestionListProps) {
  return (
    <div className={`sp-sugg sp-sugg--${width}`}>
      {title && <div className="sp-sugg__title">{title}</div>}
      <div role="listbox" id={id} aria-label={label} className="sp-sugg__list">
        {items.map((it, i) => (
          <div key={it.value} id={`${id}-${i}`} role="option" aria-selected={i === active} className="sp-sugg__item"
            onMouseDown={e => { e.preventDefault(); onPick(it.value) }}>
            <code className="sp-sugg__label">{it.label}</code>
            {it.kind}
            {it.desc && <span className="sp-sugg__desc">{it.desc}</span>}
          </div>
        ))}
        {items.length === 0 && empty && <div className="sp-sugg__empty">{empty}</div>}
      </div>
    </div>
  )
}
