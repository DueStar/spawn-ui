import React from 'react'

export interface ShellRowProps {
  command: string
  output?: string
  error?: string
  running?: boolean
  runningLabel?: string
  className?: string
}

/** A `!` command in the conversation: a small terminal block where your messages sit */
export function ShellRow({ command, output, error, running, runningLabel, className }: ShellRowProps) {
  return (
    <div className={`sp-shell${className ? ` ${className}` : ''}`}>
      <div className="sp-shell__box">
        <div className="sp-shell__cmd"><b aria-hidden="true">$</b><span>{command}</span></div>
        {running && runningLabel && <div className="sp-shell__run">{runningLabel}</div>}
        {(output || error) && <pre className="sp-shell__out">{output}{error && <span className="sp-shell__err">{error}</span>}</pre>}
      </div>
    </div>
  )
}
