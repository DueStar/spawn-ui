import { Tabs as Base } from '@base-ui/react/tabs'
import { X } from '@phosphor-icons/react'
import React from 'react'
import { IconButton } from '../IconButton/IconButton'

export interface TabItem {
  value: string
  label: React.ReactNode
  /** A small picture before the label (a session's Pokémon) */
  picture?: React.ReactNode
  /** A status dot after the label */
  dot?: React.ReactNode
  title?: string
  disabled?: boolean
}

export interface TabsProps {
  /** The tab list's name for screen readers */
  label: string
  value: string
  onValueChange(value: string): void
  items: TabItem[]
  /** top: session tabs over the panes (the default) · vertical: the settings' left column */
  orientation?: 'top' | 'vertical'
  /** Shows a × beside each tab */
  onClose?(value: string): void
  /** The ×'s name for each tab */
  closeLabel?(item: TabItem): string
  /** TabPanel elements */
  children?: React.ReactNode
  className?: string
}

/** Tabs: arrows move between them, the chosen one shows its panel */
export function Tabs({ label, value, onValueChange, items, orientation = 'top', onClose, closeLabel, children, className }: TabsProps) {
  return (
    <Base.Root value={value} onValueChange={v => onValueChange(String(v))} orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      className={`sp-tabs sp-tabs--${orientation}${className ? ` ${className}` : ''}`}>
      <Base.List aria-label={label} className="sp-tabs__list">
        {items.map(it => {
          const text = typeof it.label === 'string' ? it.label : undefined
          return (
            <span key={it.value} className="sp-tabs__item" data-on={it.value === value ? '' : undefined}>
              <Base.Tab value={it.value} disabled={it.disabled} className="sp-tabs__tab" title={it.title}>
                {it.picture && <span className="sp-tabs__picture" aria-hidden="true">{it.picture}</span>}
                <span className="sp-tabs__label sp-truncate" title={it.title ?? text}>{it.label}</span>
                {it.dot}
              </Base.Tab>
              {onClose && <IconButton size="xs" icon={X} className="sp-tabs__close" label={closeLabel ? closeLabel(it) : 'Close'} onClick={() => onClose(it.value)} />}
            </span>
          )
        })}
      </Base.List>
      {children}
    </Base.Root>
  )
}

/** The panel a tab shows */
export function TabPanel({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  return <Base.Panel value={value} className={`sp-tabs__panel${className ? ` ${className}` : ''}`}>{children}</Base.Panel>
}
