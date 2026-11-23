import React from 'react'

export interface ListRowProps {
  /** setting: a settings row, its control at the right (the default) · item: a picked row in a list (the resume list) */
  look?: 'setting' | 'item'
  title: React.ReactNode
  description?: React.ReactNode
  /** The setting's control (a switch, buttons) */
  control?: React.ReactNode
  /** An item's extra buttons, shown on hover or keyboard focus */
  trailing?: React.ReactNode
  /** An item opens something: the row is a button */
  onClick?(): void
  disabled?: boolean
  className?: string
}

/** One row of a list: a setting with its control, or an item to pick */
export function ListRow({ look = 'setting', title, description, control, trailing, onClick, disabled, className }: ListRowProps) {
  const cls = `sp-list-row sp-list-row--${look}${className ? ` ${className}` : ''}`
  const text = (
    <span className="sp-list-row__text">
      <b className={`sp-list-row__title${look === 'item' ? ' sp-truncate' : ''}`}>{title}</b>
      {description && <small className="sp-list-row__desc">{description}</small>}
    </span>
  )
  if (look === 'item') {
    return (
      <div className={cls}>
        {onClick ? <button type="button" className="sp-list-row__main sp-inset-ring" onClick={onClick} disabled={disabled}>{text}</button> : <div className="sp-list-row__main">{text}</div>}
        {trailing && <span className="sp-list-row__trailing">{trailing}</span>}
      </div>
    )
  }
  return (
    <div className={cls}>
      {text}
      {control && <span className="sp-list-row__control">{control}</span>}
    </div>
  )
}
