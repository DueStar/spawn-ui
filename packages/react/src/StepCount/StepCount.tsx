import { PawPrint } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

/** The steps a turn walked (the turn's foot): a paw and the number */
export function StepCount({ steps, label }: { steps: number; label: string }) {
  return <span className="sp-steps" aria-label={label} title={label}><Icon icon={PawPrint} size={12} /><span aria-hidden="true">{steps}</span></span>
}
