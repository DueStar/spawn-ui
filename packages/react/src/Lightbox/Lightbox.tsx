import { CaretRight } from '@phosphor-icons/react'
import React from 'react'
import { Dialog } from '../Dialog/Dialog'
import { Icon } from '../Icon/Icon'

export interface LightboxProps {
  pictures: { src: string; alt: string; caption?: React.ReactNode }[]
  index: number
  onIndex(index: number): void
  onClose(): void
  labels: { title: string; prev: string; next: string; close: string }
}

/** A picture, large, over the window: ← → and the round buttons move between the ones that came together */
export function Lightbox({ pictures, index, onIndex, onClose, labels }: LightboxProps) {
  const p = pictures[index]
  const many = pictures.length > 1
  const go = (d: number) => onIndex((index + d + pictures.length) % pictures.length)
  return (
    <Dialog open onClose={onClose} title={labels.title} kind="lightbox" closeLabel={labels.close}>
      <div className="sp-lightbox" onKeyDown={e => { if (!many) return; if (e.key === 'ArrowRight') { e.preventDefault(); go(1) } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) } }}>
        {p && <figure className="sp-lightbox__fig"><img className="sp-lightbox__img" src={p.src} alt={p.alt} />{p.caption && <figcaption>{p.caption}</figcaption>}</figure>}
        {many && <>
          <button type="button" className="sp-lightbox__nav sp-lightbox__nav--prev" aria-label={labels.prev} onClick={() => go(-1)}><Icon icon={CaretRight} size={16} /></button>
          <button type="button" className="sp-lightbox__nav sp-lightbox__nav--next" aria-label={labels.next} onClick={() => go(1)}><Icon icon={CaretRight} size={16} /></button>
        </>}
      </div>
    </Dialog>
  )
}
