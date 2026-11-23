import { Menu as Base } from '@base-ui/react/menu'
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import { Check } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'
import { usePortalContainer } from '../Portal'

export interface MenuItem {
  value: string
  label: React.ReactNode
  /** A smaller line under the label */
  desc?: React.ReactNode
  icon?: PhosphorIcon
  /** A choice among the items: the chosen one carries the check (every item becomes a radio item when any has it) */
  checked?: boolean
  disabled?: boolean
}

export interface MenuProps {
  /** The button that opens it */
  trigger: React.ReactElement
  /** Its name for screen readers */
  label: string
  items: MenuItem[]
  onSelect(value: string): void
  /** A quiet word over the items */
  title?: React.ReactNode
  /** popover: the density, text size and chat menus (the default) · control: the composer's control row */
  look?: 'popover' | 'control'
  /** Opens below (the default) or above the trigger */
  placement?: 'up' | 'down'
  align?: 'start' | 'end'
  /** A width in px */
  width?: number
  open?: boolean
  onOpenChange?(open: boolean): void
}

/** A list of choices that opens from a button: arrows move, Enter picks, Esc closes */
export function Menu({ trigger, label, items, onSelect, title, look = 'popover', placement = 'down', align = 'end', width, open, onOpenChange }: MenuProps) {
  const container = usePortalContainer()
  const radio = items.some(i => i.checked !== undefined)
  const body = (it: MenuItem) => {
    const text = typeof it.label === 'string' ? it.label : undefined
    return <>
      <span className="sp-menu__mark" aria-hidden="true">{radio ? <Icon icon={Check} size={12} /> : it.icon ? <Icon icon={it.icon} size={14} /> : null}</span>
      <span className="sp-menu__text">
        <span className="sp-menu__label sp-truncate" title={text}>{it.label}</span>
        {it.desc && <small className="sp-menu__desc">{it.desc}</small>}
      </span>
    </>
  }
  return (
    <Base.Root open={open} onOpenChange={o => onOpenChange?.(o)}>
      <Base.Trigger render={trigger} />
      <Base.Portal container={container}>
        <Base.Positioner className="sp-menu-positioner" side={placement === 'up' ? 'top' : 'bottom'} align={align} sideOffset={look === 'control' ? 4 : 6}>
          <Base.Popup aria-label={label} className={`sp-menu sp-menu--${look}${items.some(i => i.desc) ? ' sp-menu--described' : ''}`} style={width ? { width } : undefined}>
            {title && <div className="sp-menu__title">{title}</div>}
            {radio
              ? <Base.RadioGroup value={items.find(i => i.checked)?.value ?? null}>
                  {items.map(it => (
                    <Base.RadioItem key={it.value} value={it.value} disabled={it.disabled} closeOnClick className="sp-menu__item" onClick={() => { if (!it.disabled) onSelect(it.value) }}>
                      {body(it)}
                    </Base.RadioItem>
                  ))}
                </Base.RadioGroup>
              : items.map(it => (
                  <Base.Item key={it.value} disabled={it.disabled} className="sp-menu__item" onClick={() => { if (!it.disabled) onSelect(it.value) }}>
                    {body(it)}
                  </Base.Item>
                ))}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  )
}
