import React, { createContext, useContext } from 'react'

const Ctx = createContext<HTMLElement | null>(null)

/** Popups (dialogs, menus, tooltips) inside open in `container` instead of the page's body: a docs preview's text size reaches them */
export function PortalProvider({ container, children }: { container: HTMLElement | null; children: React.ReactNode }) {
  return <Ctx.Provider value={container}>{children}</Ctx.Provider>
}

/** Where popups open: the PortalProvider's container, or undefined (the body) */
export function usePortalContainer(): HTMLElement | undefined {
  return useContext(Ctx) ?? undefined
}
