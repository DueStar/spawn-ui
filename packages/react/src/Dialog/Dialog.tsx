import { Dialog as Base } from '@base-ui/react/dialog'
import { X } from '@phosphor-icons/react'
import React from 'react'
import { IconButton } from '../IconButton/IconButton'
import { usePortalContainer } from '../Portal'

export interface DialogProps {
  open: boolean
  /** Esc, the backdrop, or the close button */
  onClose(): void
  /** Its name (shown in the head unless hideTitle) */
  title: string
  /** picker: the resume list (the default) · settings: two columns · full: a reading view · lightbox: a picture · popover: a small form */
  kind?: 'picker' | 'settings' | 'full' | 'lightbox' | 'popover'
  /** Keep the title for screen readers only */
  hideTitle?: boolean
  /** More in the head, after the title */
  head?: React.ReactNode
  foot?: React.ReactNode
  /** settings: the left column (its tabs) */
  sidebar?: React.ReactNode
  /** The close button's name */
  closeLabel?: string
  /** Where the focus starts (default: the first control, which is the × in a head) */
  initialFocus?: React.RefObject<HTMLElement | null>
  /** Where the focus goes on close (default: what opened it) */
  finalFocus?: React.RefObject<HTMLElement | null>
  /** window: over the whole app (the default) · pane: inside the PortalProvider's container (the chat's full view) */
  scope?: 'window' | 'pane'
  children?: React.ReactNode
  className?: string
}

/** A window over the app: keeps Tab inside, closes on Esc or the backdrop, gives the focus back on close */
export function Dialog({ open, onClose, title, kind = 'picker', hideTitle, head, foot, sidebar, closeLabel = 'Close', initialFocus, finalFocus, scope = 'window', children, className }: DialogProps) {
  const container = usePortalContainer()
  // settings draws its title in its own column and the lightbox has none: no head (spawn's .set-modal, .chat-lightbox)
  const showHead = !hideTitle && kind !== 'lightbox' && kind !== 'settings'
  return (
    <Base.Root open={open} onOpenChange={o => { if (!o) onClose() }}>
      <Base.Portal container={container}>
        <div className={`sp-dialog sp-dialog--${kind}${scope === 'pane' ? ' sp-dialog--pane' : ''}${className ? ` ${className}` : ''}`}>
          <Base.Backdrop className="sp-dialog__backdrop" />
          <Base.Viewport className="sp-dialog__viewport">
            <Base.Popup className="sp-dialog__popup" initialFocus={initialFocus} finalFocus={finalFocus}>
              {showHead
                ? <div className="sp-dialog__head"><Base.Title className="sp-dialog__title sp-truncate">{title}</Base.Title>{head}<Base.Close render={<IconButton icon={X} label={closeLabel} size="head" />} /></div>
                : <Base.Title className="sp-visually-hidden">{title}</Base.Title>}
              {sidebar
                ? <div className="sp-dialog__split"><div className="sp-dialog__sidebar">{sidebar}</div><div className="sp-dialog__body">{children}</div></div>
                : <div className="sp-dialog__body">{children}</div>}
              {foot && <div className="sp-dialog__foot">{foot}</div>}
              {!showHead && <Base.Close render={<IconButton icon={X} label={closeLabel} size={kind === 'lightbox' ? 'lg' : 'head'} className="sp-dialog__corner" />} />}
            </Base.Popup>
          </Base.Viewport>
        </div>
      </Base.Portal>
    </Base.Root>
  )
}
