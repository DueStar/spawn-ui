import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
afterEach(() => cleanup())
// jsdom has no PointerEvent (Base UI makes one on a click): a MouseEvent with a pointer type stands in
if (typeof window !== 'undefined' && !('PointerEvent' in window)) {
  class PointerEventShim extends MouseEvent {
    pointerId: number; pointerType: string
    constructor(type: string, init: PointerEventInit = {}) { super(type, init); this.pointerId = init.pointerId ?? 1; this.pointerType = init.pointerType ?? 'mouse' }
  }
  ;(window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventShim
}
