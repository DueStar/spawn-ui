import React, { forwardRef } from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** outline: a hairline (the default) · solid: filled with ink, the one strong action · ghost: no line · link: underlined words */
  variant?: 'solid' | 'outline' | 'ghost' | 'link'
  /** xs 24px (the chat's buttons) · sm 28px (a card's buttons, the default) · md (dialogs and settings) */
  size?: 'xs' | 'sm' | 'md'
}

/** A button. Never yellow: spawn keeps yellow for what is chosen and for send. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'outline', size = 'sm', type = 'button', className, ...rest }, ref) {
  return <button ref={ref} type={type} className={`sp-button sp-button--${variant} sp-button--${size}${className ? ` ${className}` : ''}`} {...rest} />
})
