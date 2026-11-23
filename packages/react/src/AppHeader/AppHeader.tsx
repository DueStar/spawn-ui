import React from 'react'

export interface AppHeaderProps {
  /** The wordmark */
  brand: React.ReactNode
  actions?: React.ReactNode
  windowControls?: React.ReactNode
  /** mac leaves room at the left for the traffic lights */
  platform?: 'win' | 'mac'
  className?: string
}

/** The window's head: drags the window; its buttons do not */
export function AppHeader({ brand, actions, windowControls, platform = 'win', className }: AppHeaderProps) {
  return (
    <header className={`sp-app-header${platform === 'mac' ? ' sp-app-header--mac' : ''}${className ? ` ${className}` : ''}`}>
      <span className="sp-app-header__brand">{brand}</span>
      {actions}
      {windowControls}
    </header>
  )
}

/** The bar over the right side (the views, the text size, the window's buttons) */
export function TopBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`sp-top-bar${className ? ` ${className}` : ''}`}>{children}</div>
}
