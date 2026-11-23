// spawn-ui docs: Astro Starlight, Korean at /, English at /en/
import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

const group = (ko, en, items) => ({ label: ko, translations: { en }, items })
const page = (ko, en, slug) => ({ label: ko, translations: { en }, slug })

export default defineConfig({
  site: 'https://duestar.github.io',
  base: '/spawn-ui',
  integrations: [
    react(),
    starlight({
      title: 'spawn-ui',
      description: 'spawn의 디자인 시스템',
      defaultLocale: 'root',
      locales: { root: { label: '한국어', lang: 'ko' }, en: { label: 'English', lang: 'en' } },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/DueStar/spawn-ui' }],
      customCss: ['@spawn-ui/react/styles.css', './src/styles/site.css'],
      components: { ThemeProvider: './src/components/overrides/ThemeProvider.astro', ThemeSelect: './src/components/overrides/ThemeSelect.astro' },
      sidebar: [
        group('시작하기', 'Getting Started', [
          page('소개', 'Introduction', 'getting-started/introduction'),
          page('디자인 원칙', 'Design Principles', 'getting-started/principles'),
          page('설치', 'Installation', 'getting-started/installation'),
          page('플레이그라운드', 'Playground', 'getting-started/playground'),
          page('왜 spawn-ui인가', 'Why spawn-ui', 'getting-started/why'),
        ]),
        group('토큰', 'Tokens', [
          page('색', 'Color', 'tokens/color'),
          page('글꼴', 'Typography', 'tokens/typography'),
          page('크기와 모서리', 'Size & Radius', 'tokens/size'),
          page('움직임', 'Motion', 'tokens/motion'),
        ]),
        group('컴포넌트', 'Components', [
          page('전체', 'All Components', 'components'),
          group('기초', 'Foundations', [{ autogenerate: { directory: 'components/foundations' } }]),
          group('동작', 'Actions', [{ autogenerate: { directory: 'components/actions' } }]),
          group('상태', 'Status', [{ autogenerate: { directory: 'components/status' } }]),
          group('담는 것', 'Containers', [{ autogenerate: { directory: 'components/containers' } }]),
          group('spawn · 세션', 'spawn · sessions', [{ autogenerate: { directory: 'components/sessions' } }]),
          group('spawn · 게임', 'spawn · game', [{ autogenerate: { directory: 'components/game' } }]),
          group('spawn · 채팅', 'spawn · chat', [{ autogenerate: { directory: 'components/chat' } }]),
        ]),
        group('릴리스', 'Releases', [
          page('@spawn-ui/tokens', '@spawn-ui/tokens', 'releases/tokens'),
          page('@spawn-ui/react', '@spawn-ui/react', 'releases/react'),
        ]),
      ],
    }),
  ],
})
