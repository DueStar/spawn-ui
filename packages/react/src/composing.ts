/** True while an input method (Korean, Japanese …) is still composing: an Enter then ends the word, it does not submit */
export function isComposing(e: { nativeEvent: KeyboardEvent; keyCode?: number }): boolean {
  return !!e.nativeEvent.isComposing || e.keyCode === 229 || e.nativeEvent.keyCode === 229
}
