# spawn-ui

[한국어](README.md)

spawn-ui is the design system of [spawn](https://github.com/DueStar/spawn), a desktop app for working with Claude Code sessions alongside Pokémon. It holds the tokens and React components spawn itself runs on, and the docs site that explains them.

- `packages/tokens` — colour, type, spacing, radius and motion values (`@spawn-ui/tokens`)
- `packages/react` — components (`@spawn-ui/react`)
- `apps/docs` — the docs site (Korean · English)

The rules spawn keeps as tests (yellow only on what is chosen, one focus ring, contrast floors…) are kept as tests here too.

## Development

```bash
npm install
npm test
npm run docs:dev
```
