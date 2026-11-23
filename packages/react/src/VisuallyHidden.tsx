import React from 'react'
/** Text for screen readers only */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sp-visually-hidden">{children}</span>
}
