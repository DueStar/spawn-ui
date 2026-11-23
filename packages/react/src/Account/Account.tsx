import React from 'react'

export interface AccountProps {
  user?: { name: string; email?: string; photo?: string }
  signInLabel: string
  onSignIn(): void
  /** Opens the account card (signed in) */
  onOpen?(): void
  className?: string
}

/** Signed out: 로그인. Signed in: the round avatar (the photo, or the name's first letter) */
export function Account({ user, signInLabel, onSignIn, onOpen, className }: AccountProps) {
  if (!user) return <button type="button" className={`sp-account__signin${className ? ` ${className}` : ''}`} onClick={onSignIn}>{signInLabel}</button>
  return (
    <button type="button" className={`sp-account__avatar${className ? ` ${className}` : ''}`} aria-label={user.name} title={user.email ? `${user.name} · ${user.email}` : user.name} onClick={onOpen}>
      {user.photo ? <img src={user.photo} alt="" /> : <span aria-hidden="true">{Array.from(user.name)[0]?.toUpperCase()}</span>}
    </button>
  )
}
