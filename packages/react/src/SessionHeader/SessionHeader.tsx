import React from 'react'
import { useConfirm } from '../useConfirm'

export interface SessionHeaderProps {
  /** A SessionPicture at 22 */
  picture: React.ReactNode
  name: string
  project?: string
  branch?: string
  /** The chat's tools (the density menu, the changes button) */
  tools?: React.ReactNode
  /** 채팅 · 터미널 */
  lens?: React.ReactNode
  /** A double-click on the name */
  onRename?(): void
  /** Shown in place of the name while renaming (a TextInput look="rename") */
  renaming?: React.ReactNode
  /** The × asks once, then closes */
  onClose?(): void
  closeLabel?: string
  closeConfirmLabel?: string
  className?: string
}

/** The bar over a session: who it is, where it works, its tools, and its × */
export function SessionHeader({ picture, name, project, branch, tools, lens, onRename, renaming, onClose, closeLabel, closeConfirmLabel, className }: SessionHeaderProps) {
  const close = useConfirm(onClose)
  return (
    <div className={`sp-session-header${className ? ` ${className}` : ''}`}>
      <div className="sp-session-header__head">
        {picture && <span className="sp-session-header__pic">{picture}</span>}
        {renaming ?? <span className="sp-session-header__name" title={name} onDoubleClick={onRename}>{name}</span>}
        {project && <span className="sp-session-header__project">{project}</span>}
        {branch && <span className="sp-session-header__branch" title={branch}>{branch}</span>}
        <span className="sp-session-header__spacer" />
        {tools && <span className="sp-session-header__tools">{tools}</span>}
        {lens}
        {onClose && (
          <button type="button" className={`sp-session-header__close${close.asking ? ' sp-session-header__close--confirm' : ''}`} aria-label={closeLabel ?? 'Close'} title={closeLabel} onClick={close.press}>
            {close.asking ? (closeConfirmLabel ?? 'Close?') : '×'}
          </button>
        )}
      </div>
    </div>
  )
}
