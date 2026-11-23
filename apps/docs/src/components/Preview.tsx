import React, { useState } from 'react'

const SCALES = [80, 90, 100, 110, 120, 130] as const

/**
 * A live preview on spawn's own surface, with the text-size switch spawn has (80–130 %): the components grow
 * with the tokens, as they do in the app. `code` is shown under it.
 */
export default function Preview({ children, code, surface = 'bg' }: { children: React.ReactNode; code?: string; surface?: 'bg' | 'card' | 'side-bg' }) {
  const [scale, setScale] = useState<(typeof SCALES)[number]>(100)
  const [showCode, setShowCode] = useState(false)
  return (
    <div className="dsp-preview not-content">
      <div className="dsp-preview__bar">
        <div role="group" aria-label="글자 크기" className="dsp-preview__scales">
          {SCALES.map(s => (
            <button key={s} type="button" aria-pressed={s === scale} onClick={() => setScale(s)}>{s}%</button>
          ))}
        </div>
        {code && <button type="button" className="dsp-preview__code-toggle" aria-expanded={showCode} onClick={() => setShowCode(v => !v)}>{'</>'}</button>}
      </div>
      <div className={`dsp-preview__stage sp-root${scale === 100 ? '' : ` sp-ts-${scale}`}`} style={{ background: `var(--${surface})` }}>
        {children}
      </div>
      {code && showCode && <pre className="dsp-preview__code"><code>{code.trim()}</code></pre>}
    </div>
  )
}
