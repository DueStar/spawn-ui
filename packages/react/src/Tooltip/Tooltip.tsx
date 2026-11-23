import { Tooltip as Base } from '@base-ui/react/tooltip'
import React, { useEffect } from 'react'
import { usePortalContainer } from '../Portal'

export interface TooltipProps {
  content: React.ReactNode
  /** The thing it describes (focusable) */
  children: React.ReactElement
  /** note: beside a control (the default) · tab: a wider note over the panes */
  look?: 'note' | 'tab'
  placement?: 'top' | 'bottom' | 'left' | 'right'
  open?: boolean
  onOpenChange?(open: boolean): void
  /** A controlled note that closes itself after this many ms (the view switch's note) */
  timeout?: number
  /** ms before it shows on hover (default 600) */
  delay?: number
}

/** A short note on hover or keyboard focus. spawn keeps the browser's title until the owner asks; this is offered. */
export function Tooltip({ content, children, look = 'note', placement = 'bottom', open, onOpenChange, timeout, delay = 600 }: TooltipProps) {
  const container = usePortalContainer()
  useEffect(() => {
    if (!open || !timeout) return
    const t = setTimeout(() => onOpenChange?.(false), timeout)
    return () => clearTimeout(t)
  }, [open, timeout, onOpenChange])
  return (
    <Base.Root open={open} onOpenChange={o => onOpenChange?.(o)}>
      <Base.Trigger render={children} delay={delay} />
      <Base.Portal container={container}>
        <Base.Positioner className="sp-tooltip-positioner" side={placement} sideOffset={6}>
          <Base.Popup className={`sp-tooltip sp-tooltip--${look}`}>{content}</Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  )
}
