import { Copy } from '@phosphor-icons/react'
import React from 'react'
import { Icon } from '../Icon/Icon'

export interface CodeBlockProps {
  lang?: string
  code: string
  onCopy?(): void
  copyLabel?: string
  className?: string
}

/** Code in a well on the terminal's ground, its language and a copy button above */
export function CodeBlock({ lang, code, onCopy, copyLabel = 'Copy', className }: CodeBlockProps) {
  return (
    <div className={`sp-code${className ? ` ${className}` : ''}`}>
      <div className="sp-code__head">
        <span className="sp-code__lang">{lang}</span>
        {onCopy && <button type="button" className="sp-code__copy" onClick={onCopy}><Icon icon={Copy} size={12} />{copyLabel}</button>}
      </div>
      <pre><code>{code}</code></pre>
    </div>
  )
}
