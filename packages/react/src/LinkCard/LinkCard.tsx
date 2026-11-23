import { Globe } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface LinkCardProps {
  url: string
  title: string
  desc?: string
  /** The link's host */
  site?: string
  /** A picture the app made (a blob: URL) */
  image?: string
  /** The link's name (링크 미리보기: {title}) */
  label: string
  /** The app opens the address (http/https only) */
  onOpen(): void
}

/** A link's preview after the text that holds it: the whole card is one link */
export function LinkCard({ url, title, desc, site, image, label, onOpen }: LinkCardProps) {
  return (
    <a href={url} className={`sp-og${image ? ' sp-og--img' : ''}`} aria-label={label} onClick={e => { e.preventDefault(); onOpen() }} onAuxClick={e => e.preventDefault()} draggable={false}>
      <span className="sp-og__main">
        {site && <span className="sp-og__site"><Icon icon={Globe} size={12} /><span className="sp-og__host">{site}</span></span>}
        <span className="sp-og__title">{title}</span>
        {desc && <span className="sp-og__desc">{desc}</span>}
      </span>
      {image && <img className="sp-og__img" src={image} alt="" />}
    </a>
  )
}
