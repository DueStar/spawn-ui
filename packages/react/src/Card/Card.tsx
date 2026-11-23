import React, { forwardRef } from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** surface: a filled card (the default) · flat: a hairline, no fill · well: holds code or a diff · section: the side panel's band */
  look?: 'surface' | 'flat' | 'well' | 'section'
  /** widget 10px 12px (the default) · chat 12px 14px with a 10px gap · system 16px (surface and flat) */
  pad?: 'widget' | 'chat' | 'system'
  /** A well's fill: card, or term (the terminal's black, under code and diffs) */
  well?: 'card' | 'term'
  /** Asks for the person: an amber edge and a bar inside the left side (spawn's asking card) */
  attention?: boolean
}

/** A box that holds things: spawn's widget card, chat card, rank card, code and diff wells */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ look = 'surface', pad = 'widget', well = 'card', attention, className, ...rest }, ref) {
  const cls = ['sp-card', `sp-card--${look}`]
  if (look === 'well') cls.push(`sp-card--well-${well}`)
  else if (look !== 'section') cls.push(`sp-card--pad-${pad}`)
  if (attention) cls.push('sp-card--attention')
  if (className) cls.push(className)
  return <div ref={ref} className={cls.join(' ')} {...rest} />
})
