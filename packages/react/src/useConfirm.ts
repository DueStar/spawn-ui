import { useEffect, useRef, useState } from 'react'

/** spawn's two-step close: the first press asks (for 3 s), the second does it */
export function useConfirm(action: (() => void) | undefined, ms = 3000) {
  const [asking, setAsking] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => () => clearTimeout(timer.current), [])
  const press = () => {
    clearTimeout(timer.current)
    if (asking) { setAsking(false); action?.(); return }
    setAsking(true)
    timer.current = setTimeout(() => setAsking(false), ms)
  }
  return { asking, press }
}
