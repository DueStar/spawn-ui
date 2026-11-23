import React from 'react'

export interface DiffLine {
  type: 'add' | 'del' | 'ctx' | 'gap'
  text: string
  old?: number
  new?: number
}

export interface DiffBlockProps {
  file: string
  /** 수정, 새 파일 … */
  kind?: React.ReactNode
  /** Already split (spawn-ui does not diff) */
  lines: DiffLine[]
  added?: number
  removed?: number
  /** The counts in words (+1 −1 is not enough for a screen reader) */
  countsLabel?: string
  /** Said before an added / removed line (the sign alone is not read) */
  addedLabel?: string
  removedLabel?: string
  /** inline: in the conversation, scrolls sideways · card: in a permission card, wraps, max 220 · panel: the changes panel, wraps */
  look?: 'inline' | 'card' | 'panel'
  numbers?: boolean
  maxLines?: number
  moreLabel?: string
  onMore?(): void
  onOpenFile?(): void
  className?: string
}

const SIGN = { add: '+', del: '−', ctx: ' ', gap: '…' } as const

/** A file's change: its name, the counts, the lines on their tints */
export function DiffBlock({ file, kind, lines, added, removed, countsLabel, addedLabel = 'added', removedLabel = 'removed', look = 'inline', numbers = true, maxLines, moreLabel, onMore, onOpenFile, className }: DiffBlockProps) {
  const shown = maxLines !== undefined ? lines.slice(0, maxLines) : lines
  return (
    <div className={`sp-diff sp-diff--${look}${className ? ` ${className}` : ''}`}>
      <div className="sp-diff__head">
        {kind && <span className="sp-diff__kind">{kind}</span>}
        {onOpenFile ? <button type="button" className="sp-diff__file" title={file} onClick={onOpenFile}>{file}</button> : <span className="sp-diff__file" title={file}>{file}</span>}
        {(added !== undefined || removed !== undefined) && (
          <span className="sp-diff__counts">
            {added !== undefined && <span className="sp-diff__a" aria-hidden={countsLabel ? true : undefined}>+{added}</span>}
            {removed !== undefined && <span className="sp-diff__d" aria-hidden={countsLabel ? true : undefined}>−{removed}</span>}
            {countsLabel && <span className="sp-visually-hidden">{countsLabel}</span>}
          </span>
        )}
      </div>
      <div className="sp-diff__lines">
        {shown.map((l, i) => (
          <div key={i} className={`sp-diff__line sp-diff__line--${l.type}${numbers ? '' : ' sp-diff__line--nonum'}`}>
            {numbers && <span className="sp-diff__no">{l.type === 'del' ? l.old : l.new ?? l.old ?? ''}</span>}
            <span className="sp-diff__sign" aria-hidden="true">{SIGN[l.type]}</span>
            {(l.type === 'add' || l.type === 'del') && <span className="sp-visually-hidden">{l.type === 'add' ? addedLabel : removedLabel}</span>}
            <span>{l.text}</span>
          </div>
        ))}
      </div>
      {onMore && moreLabel && <button type="button" className="sp-diff__more" onClick={onMore}>{moreLabel}</button>}
    </div>
  )
}
