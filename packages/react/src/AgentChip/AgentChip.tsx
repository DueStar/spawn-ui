import React from 'react'

export interface AgentChipProps {
  name: string
  state: 'run' | 'wait' | 'done'
  /** The state in words (said with the name) */
  stateLabel: string
  /** Its last line, quiet */
  last?: string
  time?: string
  on?: boolean
  /** Finished: it fades out after a moment */
  gone?: boolean
  onOpen(): void
}

/** A sub-agent at work, as a chip over the composer: its dot, its name, its time; opens its panel */
export function AgentChip({ name, state, stateLabel, last, time, on, gone, onOpen }: AgentChipProps) {
  return (
    <button type="button" className={`sp-agent-chip sp-agent-chip--${state}${on ? ' sp-agent-chip--on' : ''}${gone ? ' sp-agent-chip--gone' : ''}`} title={name} aria-label={`${name} · ${stateLabel}`} aria-pressed={on} onClick={onOpen}>
      <span className="sp-agent-chip__mark" aria-hidden="true"><i /></span>
      <span className="sp-agent-chip__name">{name}</span>
      {last && <span className="sp-agent-chip__last">{last}</span>}
      {time && <span className="sp-agent-chip__time">{time}</span>}
    </button>
  )
}
