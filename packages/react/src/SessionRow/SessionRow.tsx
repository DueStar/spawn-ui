import React from 'react'
import { Meter, meterTone } from '../Meter/Meter'
import { Pill } from '../Pill/Pill'
import { useConfirm } from '../useConfirm'

export type SessionMood = 'working' | 'needs-you' | 'error' | 'idle' | 'ended'

export interface SessionRowProps {
  name: string
  mood: SessionMood
  /** The mood in words (said with the name; shown beside the dot in the detailed look) */
  moodLabel: string
  /** A SessionPicture (or the app's own) */
  picture: React.ReactNode
  project?: string
  branch?: string
  /** The AI tool, when not the default one */
  tool?: string
  lv?: number
  /** The helpers' pictures, on line 1 before the mood */
  helpers?: React.ReactNode
  /** Context left, 0–1 (left out: no bar, as a plain shell) */
  hp?: number
  /** The context is full: the bar fades */
  hpFull?: boolean
  /** The bar's word (HP, or 컨텍스트 in work mode) */
  hpLabel?: string
  /** The bar's name for screen readers */
  hpTitle?: string
  model?: string
  /** Tokens left, as words (124K) */
  tokens?: string
  chosen?: boolean
  /** 간략: one line */
  compact?: boolean
  /** Picked up by the pointer */
  lifted?: boolean
  /** In the floating widget card: the chosen bar sits 4px in, not 8 */
  widget?: boolean
  /** A question asked in the row (a Banner layout="row") */
  asking?: React.ReactNode
  onOpen(): void
  /** F2, or the ✎ button */
  onRename?(): void
  renameLabel?: string
  /** The × asks once, then closes */
  onClose?(): void
  closeLabel?: string
  closeConfirmLabel?: string
  /** The ×'s hover words while it asks (one more press closes) */
  closeConfirmHint?: string
  /** More buttons beside ✎ and × on hover (the swap) */
  tools?: React.ReactNode
  title?: string
  className?: string
}

/** One session in the list: its Pokémon, name, state and HP. Enter opens it, F2 renames, the × asks before it closes. */
export function SessionRow(p: SessionRowProps) {
  const { name, mood, moodLabel, picture, chosen, compact, lifted, widget, onOpen, onRename, onClose } = p
  const closer = useConfirm(onClose)
  const confirm = closer.asking
  const pressClose = (e: React.MouseEvent) => { e.stopPropagation(); closer.press() }
  const keys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() }
    else if (e.key === 'F2' && onRename) { e.preventDefault(); onRename() }
  }
  const cls = ['sp-session-row', `sp-session-row--${mood}`]
  if (chosen) cls.push('sp-session-row--chosen')
  if (compact) cls.push('sp-session-row--compact')
  if (lifted) cls.push('sp-session-row--lifted')
  if (widget) cls.push('sp-session-row--widget')
  if (p.className) cls.push(p.className)
  const pill = mood === 'ended' ? <Pill mood="idle">{moodLabel}</Pill> : <Pill mood={mood}>{moodLabel}</Pill>
  const close = onClose && (
    <button type="button" className={`sp-session-row__close${confirm ? ' sp-session-row__close--confirm' : ''}`} aria-label={confirm ? (p.closeConfirmLabel ?? 'Close?') : (p.closeLabel ?? 'Close')} title={confirm ? (p.closeConfirmHint ?? p.closeConfirmLabel) : p.closeLabel} onClick={pressClose} onKeyDown={e => e.stopPropagation()}>
      {confirm ? (p.closeConfirmLabel ?? 'Close?') : '×'}
    </button>
  )
  const tone = p.hp === undefined ? null : meterTone('hp', p.hp)
  return (
    <div role="button" tabIndex={0} aria-label={`${name}, ${moodLabel}${p.hpTitle ? `, ${p.hpTitle}` : ''}`} aria-current={chosen ? 'true' : undefined} title={p.title}
      className={cls.join(' ')} onClick={onOpen} onKeyDown={keys}>
      <div className="sp-session-row__head">
        <span className="sp-session-row__picture">{picture}</span>
        <div className="sp-session-row__line1">
          <span className="sp-session-row__name" title={name}>{name}</span>
          {compact ? <>
            {tone && <span className={`sp-session-row__tick sp-session-row__tick--${tone}${p.hpFull ? ' sp-session-row__tick--full' : ''}`} aria-hidden="true" />}
            <span className="sp-session-row__state">{pill}{close}</span>
          </> : <>
            {p.helpers && <span className="sp-session-row__helpers">{p.helpers}</span>}
            {pill}
          </>}
        </div>
        {!compact && (
          <div className="sp-session-row__line2">
            {p.lv !== undefined && <span className="sp-session-row__lv">Lv.{p.lv}</span>}
            <span className="sp-session-row__meta">
              {p.project && <span className="sp-session-row__project">{p.project}</span>}
              {p.tool && <span className="sp-session-row__tool">{p.tool}</span>}
              {p.branch && <span className="sp-session-row__branch">{p.branch}</span>}
            </span>
            {(onRename || onClose || p.tools) && (
              <span className="sp-session-row__tools">
                {onRename && <button type="button" className="sp-session-row__edit" aria-label={p.renameLabel ?? 'Rename'} title={p.renameLabel} onClick={e => { e.stopPropagation(); onRename() }}>✎</button>}
                {p.tools}
                {close}
              </span>
            )}
          </div>
        )}
      </div>
      {!compact && p.hp !== undefined && (
        <div className="sp-session-row__bottom">
          <span className="sp-session-row__hp-label" aria-hidden="true">{p.hpLabel ?? 'HP'}</span>
          <Meter kind="hp" value={p.hp} full={p.hpFull} label={p.hpTitle ?? `${p.hpLabel ?? 'HP'} ${Math.round(p.hp * 100)}%`} />
          <span className="sp-session-row__model">{p.model ?? ''}</span>
          <span className="sp-session-row__num">{p.tokens ?? `${Math.round(p.hp * 100)}%`}</span>
        </div>
      )}
      {p.asking}
    </div>
  )
}
