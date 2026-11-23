/** WCAG relative luminance and contrast ratio of two opaque hex colours (as spawn's tokens test) */
function rgb(c: string): number[] {
  if (!c.startsWith('#')) throw new Error(`not an opaque hex colour: ${c}`)
  const n = c.length === 4 ? c.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3') : c
  return [1, 3, 5].map(i => parseInt(n.slice(i, i + 2), 16))
}
const lum = (c: string) =>
  rgb(c)
    .map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) })
    .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0)

export function contrast(fg: string, bg: string): number {
  const x = lum(fg)
  const y = lum(bg)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
