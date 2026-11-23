# spawn-ui

[English](README.en.md)

spawn-ui는 [spawn](https://github.com/DueStar/spawn)의 디자인 시스템이에요. spawn은 Claude Code 세션을 포켓몬과 함께 쓰는 데스크톱 앱이고, spawn-ui는 그 앱이 실제로 쓰는 토큰과 React 컴포넌트, 그리고 그걸 설명하는 문서 사이트를 담고 있어요.

- `packages/tokens` — 색, 글자, 간격, 모서리, 움직임 값 (`@spawn-ui/tokens`)
- `packages/react` — 컴포넌트 (`@spawn-ui/react`)
- `apps/docs` — 문서 사이트 (한국어 · English)

spawn이 테스트로 지켜 온 규칙(노랑은 고른 것에만, 하나의 포커스 링, 명암 기준 등)은 여기서도 테스트로 지켜요.

## 개발

```bash
npm install
npm test
npm run docs:dev
```
