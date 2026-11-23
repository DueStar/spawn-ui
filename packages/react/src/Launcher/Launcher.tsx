import { FolderOpen, Plus, Stack } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface LauncherProps {
  newLabel: string
  onNew(): void
  folderLabel?: string
  onFolder?(): void
  resumeLabel?: string
  onResume?(): void
  className?: string
}

/** Start a session: the one wide button, and the folder and resume beside it */
export function Launcher({ newLabel, onNew, folderLabel, onFolder, resumeLabel, onResume, className }: LauncherProps) {
  return (
    <div className={`sp-launcher${className ? ` ${className}` : ''}`}>
      <button type="button" className="sp-launcher__main" onClick={onNew}>
        <Icon icon={Plus} size={16} /><span className="sp-truncate">{newLabel}</span>
      </button>
      {onFolder && <button type="button" className="sp-launcher__alt" aria-label={folderLabel} title={folderLabel} onClick={onFolder}><Icon icon={FolderOpen} size={14} /></button>}
      {onResume && <button type="button" className="sp-launcher__alt" aria-label={resumeLabel} title={resumeLabel} onClick={onResume}><Icon icon={Stack} size={14} /></button>}
    </div>
  )
}
