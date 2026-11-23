import React from 'react'

export interface PokemonSpriteProps {
  src: string
  /** Its name for screen readers; left out, the picture is decorative (the name is beside it) */
  alt?: string
  /** px */
  size: number
  /** Never larger than its natural size, up to `size` (the box icon look) */
  max?: boolean
  /** Not caught yet: a grey shape */
  silhouette?: boolean
  /** Faded in the log */
  faded?: boolean
  /** Hard pixels: only the wild row */
  pixelated?: boolean
  className?: string
}

/** A Pokémon's picture: smooth, contained, never dragged by accident */
export function PokemonSprite({ src, alt = '', size, max, silhouette, faded, pixelated, className }: PokemonSpriteProps) {
  const cls = ['sp-sprite']
  if (silhouette) cls.push('sp-silhouette')
  if (faded) cls.push('sp-sprite--faded')
  if (pixelated) cls.push('sp-sprite--pixelated')
  if (className) cls.push(className)
  return max
    ? <img src={src} alt={alt} draggable={false} className={cls.join(' ')} style={{ maxWidth: size, maxHeight: size }} />
    : <img src={src} alt={alt} draggable={false} width={size} height={size} className={cls.join(' ')} />
}
