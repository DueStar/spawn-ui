import React from 'react'

/** The line under the composer: the model, the thinking, the mode, the context */
export function ControlRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`sp-ctrl${className ? ` ${className}` : ''}`}>{children}</div>
}

export interface ControlItemProps {
  /** Its word, said with the value */
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  /** A button when given (it opens a Menu: wrap it as the Menu's trigger) */
  onClick?(): void
}

/** One item of the control row: its glyph and value; a button when it can be changed */
export const ControlItem = React.forwardRef<HTMLButtonElement, ControlItemProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(function ControlItem({ label, value, icon, onClick, ...rest }, ref) {
  const inner = <>{icon}<b>{value}</b></>
  return onClick || rest['aria-haspopup']
    ? <button ref={ref} type="button" className="sp-ctrl__item" aria-label={`${label}: ${typeof value === 'string' ? value : ''}`} title={label} onClick={onClick} {...rest}>{inner}</button>
    : <span className="sp-ctrl__item" title={label}>{inner}</span>
})

/** A thin divider between groups of the row */
export function ControlSep() {
  return <i className="sp-ctrl__sep" aria-hidden="true" />
}
