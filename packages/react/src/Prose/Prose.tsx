import React from 'react'

/** The app's rendered Markdown, in spawn's reading type (spawn-ui does not parse Markdown: pass the elements) */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`sp-prose${className ? ` ${className}` : ''}`}>{children}</div>
}
