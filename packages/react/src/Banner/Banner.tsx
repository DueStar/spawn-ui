import type { Icon as PhosphorIcon } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface BannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  children?: React.ReactNode
  /** card: the chat's banner (the default) · compact: the widget's ask · row: inside a session row · floating: fixed at the top */
  layout?: 'card' | 'compact' | 'row' | 'floating'
  /** An amber glyph before the words */
  icon?: PhosphorIcon
  title?: React.ReactNode
  /** Buttons after the words */
  actions?: React.ReactNode
  /** A pulsing amber dot before the title (something waits on the person) */
  pulse?: boolean
}

/** Something that needs the person: always the amber hairline, never yellow */
export function Banner({ children, layout = 'card', icon, title, actions, pulse, className, ...rest }: BannerProps) {
  return (
    <div role="status" className={`sp-banner sp-banner--${layout}${className ? ` ${className}` : ''}`} {...rest}>
      {icon && <span className="sp-banner__icon"><Icon icon={icon} size={16} /></span>}
      <div className="sp-banner__text">
        {(title || pulse) && <div className="sp-banner__head">{pulse && <i className="sp-banner__dot" aria-hidden="true" />}{title && <b className="sp-banner__title">{title}</b>}</div>}
        {children}
      </div>
      {actions && <div className="sp-banner__actions">{actions}</div>}
    </div>
  )
}
