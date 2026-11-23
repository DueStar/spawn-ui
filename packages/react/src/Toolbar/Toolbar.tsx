import React from 'react'

export interface ToolbarProps {
  /** Its name for screen readers */
  label: string
  /** dex 14px 20px 12px (the Pokédex's top) · box 8px 20px (the Box's toolbar, the default) · rank 12px 20px */
  pad?: 'dex' | 'box' | 'rank'
  children: React.ReactNode
  className?: string
}

/** The bar of filters over a page (Pokédex, Box, ranking): a bottom hairline, wraps when narrow */
function ToolbarRoot({ label, pad = 'box', children, className }: ToolbarProps) {
  return <div role="group" aria-label={label} className={`sp-toolbar sp-toolbar--${pad}${className ? ` ${className}` : ''}`}>{children}</div>
}
/** A filter's word before its control */
function ToolbarLabel({ children }: { children: React.ReactNode }) {
  return <span className="sp-toolbar__label">{children}</span>
}
export const Toolbar = Object.assign(ToolbarRoot, { Label: ToolbarLabel })
