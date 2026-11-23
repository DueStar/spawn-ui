import React, { useRef } from 'react'

export interface SegmentedOption<T extends string> {
  value: T
  label: React.ReactNode
  /** The whole label on hover (a string label is used when left out) */
  title?: string
  disabled?: boolean
}

export interface SegmentedControlProps<T extends string> {
  /** The group's name for screen readers (정렬, 보기 …) */
  label: string
  value: T
  options: SegmentedOption<T>[]
  onChange(value: T): void
  /** sm: the Pokédex's filters (24px) · md: a little roomier */
  size?: 'sm' | 'md'
  className?: string
}

/** One choice out of a few, side by side (spawn's dex filters, view switch, list mode, a document's tabs) */
export function SegmentedControl<T extends string>({ label, value, options, onChange, size = 'sm', className }: SegmentedControlProps<T>) {
  const box = useRef<HTMLDivElement>(null)
  const move = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const items = [...(box.current?.querySelectorAll<HTMLButtonElement>('.sp-segmented__item:not(:disabled)') ?? [])]
    const at = items.indexOf(e.currentTarget)
    if (at < 0 || !items.length) return
    e.preventDefault()
    items[(at + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length].focus()
  }
  return (
    <div ref={box} role="group" aria-label={label} className={`sp-segmented sp-segmented--${size}${className ? ` ${className}` : ''}`}>
      {options.map(o => {
        const on = o.value === value
        const title = o.title ?? (typeof o.label === 'string' ? o.label : undefined)
        return (
          <button key={o.value} type="button" className="sp-segmented__item" aria-pressed={on} disabled={o.disabled} title={title}
            onClick={() => { if (!on) onChange(o.value) }} onKeyDown={move}>
            <span className="sp-truncate">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
