# Site Turinq v2 — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir o site da Turinq com uma home em plano-sequência 3D (WebGL guiado pelo scroll) e páginas por área (geotecnologia, sindical, sites e sistemas), mantendo a identidade do logo.

**Architecture:**
- **Next.js 16 App Router:** páginas estáticas.
- **Canvas único:** um `<Canvas>` do React Three Fiber vive no layout e troca de cena por rota.
- **Scroll → cena:** o scroll da home (Lenis + GSAP ScrollTrigger) grava `progress` num store mínimo. Os objetos 3D leem esse valor a cada quadro e calculam o estado com funções puras (`filmFrameAt`, `cameraAt`, `globeTransformAt`), testadas com Vitest.
- **Texto:** todo o conteúdo é HTML real por cima do canvas.

**Tech Stack:** Next.js 16.2.3, React 19.2.4, Tailwind CSS 4, three 0.186, @react-three/fiber 9.8, @react-three/drei 10.7, gsap 3.15 + @gsap/react 2.1, lenis 1.3, Vitest 5.

**Spec:** `docs/superpowers/specs/2026-10-17-turinq-site-v2-design.md`

## Global Constraints

- **Versões:**
  - Node ≥ 20.9.
  - Manter `next@16.2.3`, `eslint-config-next@16.2.3` e `react`/`react-dom@19.2.4`. O R3F 9 exige React `<19.4`: **não atualizar o React**.
  - Dependências novas: `three@^0.186.1`, `@react-three/fiber@^9.8.2`, `@react-three/drei@^10.7.9`, `gsap@^3.15.0`, `@gsap/react@^2.1.2`, `lenis@^1.3.27`.
  - Dev: `vitest@^5.0.5`, `@types/three@^0.186.0`, `potrace@^2.1.8`, `world-atlas@^2.0.2`, `topojson-client@^3.1.0`, `d3-geo@^3.1.1`, `@types/d3-geo`, `@types/topojson-client`.
- **Proibido:** `framer-motion` (remover), bibliotecas de pós-processamento, áudio.
- **Next:** antes de escrever código específico do Next, ler o guia correspondente em `node_modules/next/dist/docs/01-app/` (exigência do `AGENTS.md`). `dynamic(..., { ssr: false })` só dentro de Client Component. Props de `opengraph-image` são Promises no Next 16.
- **Idioma:** só pt-BR; `<html lang="pt-BR">`.
- **Fatos:** só os de `content/site.ts` e `content/projects.ts`. Campo `null` / lista vazia = `TODO(Lucas)`, e o componente **omite** o item (nunca renderiza "TODO", "lorem" ou valor inventado). Cases sem nome de cliente.
- **Cores (hex exatos):**
  - `silver-100 #E9ECF2`, `silver-300 #C9CED9`, `paper #F2F3F6`
  - `brand #4E5472`, `brand-light #8FA3C7`, `steel #3F6A8A`
  - `night #0B0E16`, `night-surface #121725`
  - `ink #1A1D29`, `gis #7FD1C7`
- **Fontes** (`next/font/google`): `Unbounded` (títulos, `--font-unbounded`), `Manrope` (texto, `--font-manrope`), `JetBrains_Mono` (mono, `--font-jetbrains`).
- **Contraste:** todo texto em AA (≥ 4.5; ≥ 3 só para título ≥ 24 px).
- **WhatsApp:** `5522997793222`. Mensagem padrão: `Olá! Vim pelo site da Turinq e gostaria de conversar sobre um projeto.`
- **Commits:** pequenos, em português, terminando com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Branch `redesign/v2`.
- **Verificação de cada task:** `npm run check` verde antes do commit (a partir da Task 1).

## Review Focus

1. **Recarregar a home no meio do scroll** (o navegador restaura a posição em 50%): a cena deve mostrar o ato daquele ponto, sem tocar a abertura nem piscar o ato 0. Teste: `shouldPlayIntro` na Task 6 + verificação no navegador.
2. **Sair da home e voltar** (`/` → `/sobre` → `/`): nenhum ScrollTrigger pode vazar ou duplicar, e o filme recomeça do topo. Teste: verificação de `ScrollTrigger.getAll().length` na Task 10.
3. **Contexto WebGL perdido no meio da sessão** (GPU reiniciada, celular em segundo plano): o canvas some, entra o poster e o texto continua legível. Teste: `WEBGL_lose_context` na Task 5.
4. **Barra de endereço do celular aparecendo e sumindo:** o scroll não pode dar salto nem recalcular o filme. `ScrollTrigger.config({ ignoreMobileResize: true })` e alturas em `svh`. Teste: preset mobile na Task 5.
5. **Texto sobre fundo em transição** (prata → noite → papel): o texto de cada ato precisa de contraste AA com o fundo naquele trecho. Teste: `act text windows keep AA contrast` na Task 5.

---

## Estrutura de arquivos

```
app/
  layout.tsx                 fontes, metadata base, Backdrop, StageLoader, Header, Footer, SmoothScroll, PageTransition
  page.tsx                   home (FilmScroll + 6 seções de ato)
  geotecnologia/page.tsx  sindical/page.tsx  sites-e-sistemas/page.tsx  sobre/page.tsx  contato/page.tsx
  not-found.tsx  sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg  globals.css
content/
  site.ts  routes.ts  projects.ts  services.ts      (+ *.test.ts)
lib/
  color.ts  store.ts  math.ts  use-reduced-motion.ts (+ *.test.ts)
components/layout/   Header, Footer, Backdrop, SmoothScroll, TransitionLink, PageTransition, facet-grid.ts
components/brand/    Wordmark, Monogram, wordmark-data.ts (gerado), monogram-data.ts (gerado), subpaths.ts
components/ui/       Button, Reveal, FacetBullet, FilmProgress, LayerPanel, Hud, JsonLd
components/home/     FilmScroll, ActSection
components/three/
  Stage.tsx  StageLoader.tsx  SceneSwitch.tsx  Poster.tsx  StageErrorBoundary.tsx  quality.ts
  film/  timeline.ts  film-store.ts  frame.ts  camera.ts     (+ *.test.ts)
  objects/  Dust  FacetSphere (+ facets.ts)  DotGlobe (+ globe.ts)  Terrain (+ terrain.ts)  GisLayers  ScreenPanels (+ panels.ts, screens.ts)
  scenes/   FilmScene  TerrainScene  PanelsScene  SphereScene  GlobeScene
scripts/   trace-logo.mjs  build-land-points.mjs
public/data/land-points.json   (gerado)
```

Os arquivos de teste ficam ao lado do código (`*.test.ts`). O ambiente Vitest é `node`: todo teste cobre função pura, nunca DOM.

---

## Textos-chave (copy fixada)

| Lugar | Texto |
|---|---|
| Home H1 | **Do site institucional ao mapa do território.** |
| Home sub | Há mais de 20 anos a Turinq desenvolve sites, sistemas e soluções em geotecnologia — com atuação especial na área sindical. |
| CTAs hero | `Iniciar um projeto` (WhatsApp) · `Ver o que fazemos` (rola até o ato 1) |
| Ato 1 | **Mais de 20 anos escrevendo software que dura.** + os 4 números |
| Ato 2 | **Geotecnologia: o território como dado.** — Projetos com ArcGIS e plataformas baseadas em GIS, que transformam localização em decisão. → `/geotecnologia` |
| Ato 3 | **Cada camada, uma resposta.** — mapas web interativos · geoprocessamento · painéis geográficos · sistemas com base GIS |
| Ato 4 | **Das camadas às telas.** — sites institucionais · portais sindicais · sistemas de gestão · aplicativos → `/sindical`, `/sites-e-sistemas` |
| Ato 5 | **Vamos mapear o seu próximo projeto.** + CTA WhatsApp + e-mail (se houver) |
| Camadas | Relevo · Hidrografia · Lotes · Pontos de interesse |
| 404 | **Coordenada não encontrada.** — Essa página não está no nosso mapa. → `Voltar ao início` |

O texto corrido das páginas internas é escrito pelo implementador, seguindo as regras de fatos acima.

---

### Task 1: Ferramentas, conteúdo e utilitários de cor

**Files:**
- Modify: `package.json` (deps e scripts), `.gitignore` (adicionar `/.claude/launch.json`)
- Delete: `tailwind.config.js`, `postcss.config.js`, `public/{file,globe,next,vercel,window}.svg`
- Create: `vitest.config.mts`, `content/site.ts`, `content/routes.ts`, `content/projects.ts`, `content/services.ts`, `lib/color.ts`
- Test: `content/site.test.ts`, `content/routes.test.ts`, `lib/color.test.ts`

**Interfaces:**
- Produces:
  - `content/site.ts`:
    - `type Stat = { value: string; label: string }`
    - `type Site = { name: string; tagline: string; whatsapp: string; email: string | null; address: string | null; foundedYear: number | null; social: { label: string; url: string }[]; gisTools: string[]; stats: Stat[] }`
    - `const site: Site`
    - `whatsappUrl(message?: string): string`
    - `type ContactChannel = { kind: 'whatsapp' | 'email'; label: string; href: string }`
    - `contactChannels(s: Site): ContactChannel[]`
    - `siteUrl(env?: Record<string, string | undefined>): string`
  - `content/routes.ts`:
    - `type SceneId = 'film' | 'terrain' | 'panels' | 'sphere' | 'globe'`
    - `type Tone = 'light' | 'dark'`
    - `type RouteInfo = { path: string; label: string; title: string; description: string; tone: Tone; scene: SceneId; inNav: boolean }`
    - `const ROUTES: RouteInfo[]`
    - `routeFor(pathname: string): RouteInfo | null`
    - `sceneForPath(pathname: string): SceneId`
    - `toneForPath(pathname: string): Tone`
  - `content/projects.ts`: `type Project = { tag: string; title: string; description: string; area: 'sistemas' | 'sindical' | 'mobile' }` e `const projects: Project[]`.
  - `content/services.ts`: `type Service = { title: string; description: string }` e `const services: { geotecnologia: Service[]; sindical: Service[]; sitesESistemas: Service[] }`.
  - `lib/color.ts`:
    - `hexToRgb(hex: string): [number, number, number]`
    - `lerpHex(a: string, b: string, t: number): string` (retorna `#RRGGBB` maiúsculo)
    - `relativeLuminance(hex: string): number`
    - `contrastRatio(a: string, b: string): number`
    - `const TOKENS` (as 10 cores da Global Constraints, chaves `silver100`, `silver300`, `paper`, `brand`, `brandLight`, `steel`, `night`, `nightSurface`, `ink`, `gis`)

- [ ] **Step 1: Ajustar dependências e ferramentas**

Run:
```bash
npm uninstall framer-motion autoprefixer
npm install three@^0.186.1 @react-three/fiber@^9.8.2 @react-three/drei@^10.7.9 gsap@^3.15.0 @gsap/react@^2.1.2 lenis@^1.3.27
npm install -D vitest@^5.0.5 @types/three@^0.186.0 potrace@^2.1.8 world-atlas@^2.0.2 topojson-client@^3.1.0 d3-geo@^3.1.1 @types/d3-geo @types/topojson-client
git rm tailwind.config.js postcss.config.js public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg
```

Scripts em `package.json`:
```json
"lint": "eslint", "typecheck": "tsc --noEmit", "test": "vitest run",
"check": "npm run lint && npm run typecheck && npm run test && npm run build",
"trace:logo": "node scripts/trace-logo.mjs", "build:land": "node scripts/build-land-points.mjs"
```

`vitest.config.mts`: `test: { environment: 'node', include: ['**/*.test.ts'], exclude: ['node_modules', '.next'] }` e `resolve.alias: { '@': <raiz do projeto> }`. Sem plugin React.

- [ ] **Step 2: Escrever os testes que falham**

```ts
// content/site.test.ts
test('whatsappUrl codifica a mensagem padrão', () => {
  expect(whatsappUrl()).toBe('https://wa.me/5522997793222?text=' + encodeURIComponent('Olá! Vim pelo site da Turinq e gostaria de conversar sobre um projeto.'))
  expect(whatsappUrl('Oi & tchau')).toBe('https://wa.me/5522997793222?text=Oi%20%26%20tchau')
})
test('contactChannels omite e-mail ausente', () => {
  expect(contactChannels({ ...site, email: null }).map(c => c.kind)).toEqual(['whatsapp'])
  expect(contactChannels({ ...site, email: 'a@b.com' })[1]).toEqual({ kind: 'email', label: 'a@b.com', href: 'mailto:a@b.com' })
})
test('números confirmados, exatamente', () => {
  expect(site.stats).toEqual([
    { value: '20+', label: 'Anos de mercado' }, { value: '15+', label: 'Projetos entregues' },
    { value: '98%', label: 'Satisfação dos clientes' }, { value: '5+', label: 'Especialistas' }])
})
test('nenhum conteúdo exportado contém TODO ou lorem', () => {
  expect(JSON.stringify({ site, projects, services, ROUTES })).not.toMatch(/TODO|lorem/i)
})
test('siteUrl: env explícita > Vercel > localhost', () => {
  expect(siteUrl({ NEXT_PUBLIC_SITE_URL: 'https://turinq.com.br' })).toBe('https://turinq.com.br')
  expect(siteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'turinq.vercel.app' })).toBe('https://turinq.vercel.app')
  expect(siteUrl({})).toBe('http://localhost:3000')
})

// content/routes.test.ts
test('cena e tom por rota', () => {
  expect(['/', '/geotecnologia', '/sindical', '/sites-e-sistemas', '/sobre', '/contato'].map(sceneForPath))
    .toEqual(['film', 'terrain', 'panels', 'panels', 'sphere', 'sphere'])
  expect(sceneForPath('/nao-existe')).toBe('globe')
  expect(toneForPath('/geotecnologia')).toBe('dark')
  expect(toneForPath('/nao-existe')).toBe('dark')
  expect(toneForPath('/sobre')).toBe('light')
})
test('paths únicos e títulos preenchidos', () => {
  expect(new Set(ROUTES.map(r => r.path)).size).toBe(ROUTES.length)
  ROUTES.forEach(r => { expect(r.title.length).toBeGreaterThan(10); expect(r.description.length).toBeGreaterThan(50) })
})

// lib/color.test.ts
test('lerpHex', () => {
  expect(lerpHex('#000000', '#FFFFFF', 0.5)).toBe('#808080')
  expect(lerpHex('#E9ECF2', '#0B0E16', 0)).toBe('#E9ECF2')
})
test('contraste AA dos pares de texto do design', () => {
  const pairs: [string, string][] = [['ink', 'paper'], ['ink', 'silver100'], ['brand', 'paper'], ['steel', 'paper'], ['brandLight', 'night'], ['gis', 'night']]
  pairs.forEach(([fg, bg]) => expect(contrastRatio(TOKENS[fg], TOKENS[bg])).toBeGreaterThanOrEqual(4.5))
  expect(contrastRatio('#FFFFFF', TOKENS.night)).toBeGreaterThan(15)
})
```

- [ ] **Step 3: Rodar e ver falhar** — `npm test` → FAIL (módulos inexistentes).

- [ ] **Step 4: Implementar `content/*` e `lib/color.ts`**

Em `site.ts`:
- `email`, `address` e `foundedYear` ficam `null`, cada um com comentário `// TODO(Lucas): ...`.
- `social: []` com o mesmo TODO.
- `gisTools: ['ArcGIS']` com `// TODO(Lucas): confirmar ferramentas além do ArcGIS`.

Em `projects.ts`, os 3 projetos com os textos do site antigo (`git show main:app/page.tsx`, linhas 62–84), sem as chaves de cor.

Em `ROUTES`:
- tons: `/geotecnologia` = `dark`, as demais páginas listadas = `light`;
- `inNav`: true para todas, exceto `/`.

`relativeLuminance` segue a fórmula WCAG 2.x (sRGB linearizado).

- [ ] **Step 5: Rodar** — `npm test` → PASS; `npm run lint && npm run typecheck` → sem erros. O `app/page.tsx` antigo ainda importa o `framer-motion`: troque-o por um placeholder `export default function Home() { return <main /> }` para o typecheck passar. A Task 3 reescreve esse arquivo.

- [ ] **Step 6: Commit** — `chore: ferramentas, conteúdo confirmado e utilitários de cor`

---

### Task 2: Design system e casca do layout

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`, `next.config.ts` (sem mudanças funcionais; só se a doc exigir)
- Create: `components/layout/{Header,Footer,Backdrop,SmoothScroll}.tsx`, `components/ui/{Button,Reveal,FacetBullet}.tsx`, `lib/use-reduced-motion.ts`, `.claude/launch.json` (não versionado)
- Leia antes: `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` e `03-layouts-and-pages.md`

**Interfaces:**
- Consumes: `ROUTES`, `toneForPath`, `whatsappUrl`, `TOKENS` (Task 1)
- Produces:
  - `useReducedMotion(): boolean`: `matchMedia('(prefers-reduced-motion: reduce)')`, reativo. Também retorna `true` com `?motion=reduce` na URL, o que permite verificar sem mexer no SO.
  - `<Button href external? variant: 'solid' | 'ghost' tone: Tone>`
  - `<Reveal as? delay?>`: revela as linhas de texto com máscara via GSAP `useGSAP` + ScrollTrigger, `once`; sem animação se reduced motion
  - `<FacetBullet />`: triângulo SVG 10 px
  - `<Backdrop />`: div `fixed inset-0 -z-10`. Exporta `setBackdropColor(hex: string): void`, que escreve direto no DOM, sem estado React. A cada pathname fora da home, aplica a cor do tom da rota (light → `paper`, dark → `night`) e grava `document.documentElement.dataset.tone = toneForPath(pathname)`.
  - `<SmoothScroll />`:
    - cria Lenis (`autoRaf: false`), conectado a `gsap.ticker` e a `ScrollTrigger.update`;
    - chama `ScrollTrigger.config({ ignoreMobileResize: true })`;
    - não cria Lenis se reduced motion;
    - exporta `getLenis(): Lenis | null`;
    - ao mudar o pathname: `scrollTo(0, { immediate: true })` + `ScrollTrigger.refresh()`.
  - `<Header>`: monograma provisório (`/turinq-icon-branco.png` até a Task 4), nav com `ROUTES.filter(inNav)` (link ativo com `aria-current="page"`) e CTA WhatsApp. As cores seguem `data-tone` só por CSS, com a variante `@custom-variant tone-dark (&:where([data-tone=dark] *))` no `globals.css`, sem JS.

- [ ] **Step 1: Tokens Tailwind 4 em `app/globals.css`**

`@import "tailwindcss"` e um `@theme` com:
- `--color-*` para os 10 tokens;
- `--font-display: var(--font-unbounded)`, `--font-sans: var(--font-manrope)`, `--font-mono: var(--font-jetbrains)`.

Base:
- `html { background: var(--color-paper) }`;
- `:focus-visible { outline: 2px solid var(--color-gis); outline-offset: 3px }`;
- `.skip-link` visível só no foco.

Remover os gradientes azul/violeta e os keyframes antigos.

- [ ] **Step 2: `app/layout.tsx`**

- Fontes com `variable` e `display: 'swap'`.
- `metadata` com `metadataBase: new URL(siteUrl())`, `title.template: '%s · Turinq'` e descrição padrão.
- `<html lang="pt-BR" data-tone="light">`.
- Ordem no body: skip link `Pular para o conteúdo` → `#conteudo`, `<Backdrop/>`, `<SmoothScroll/>`, `<Header/>`, `<main id="conteudo">{children}</main>`, `<Footer/>`.

- [ ] **Step 3: Header, Footer, Button, Reveal, FacetBullet, `useReducedMotion`**

Footer: nav completa, `contactChannels(site)` (só os canais existentes), endereço só se existir, e `© {ano} Turinq — Tecnologia e Desenvolvimento`.

- [ ] **Step 4: Configurar o preview**

`.claude/launch.json` com `{"name":"turinq","runtimeExecutable":"npm","runtimeArgs":["run","dev"],"port":3000}`. Rodar `preview_start {name:"turinq"}`.

- [ ] **Step 5: Verificar**
  - `npm run check` → verde.
  - No preview, `read_console_messages` sem erros.
  - Header e footer renderizam em 375 px e 1280 px sem rolagem horizontal.
  - Tab a partir do topo foca primeiro o skip link.

- [ ] **Step 6: Commit** — `feat: design system e casca do layout`

---

### Task 3: Páginas com texto e SEO (site completo sem 3D)

**Files:**
- Modify: `app/page.tsx`
- Create: `app/{geotecnologia,sindical,sites-e-sistemas,sobre,contato}/page.tsx`, `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `components/home/{FilmScroll,ActSection}.tsx`, `components/ui/JsonLd.tsx`, `components/three/film/timeline.ts` (só constantes nesta task)
- Leia antes: `03-api-reference/03-file-conventions/01-metadata/{sitemap,robots,opengraph-image}.md` e `not-found.md`
- Test: `app/sitemap.test.ts`

**Interfaces:**
- Consumes: `ROUTES`, `routeFor`, `site`, `projects`, `services`, `contactChannels`, `whatsappUrl`, `Reveal`, `Button`
- Produces:
  - Em `timeline.ts`:
    - `type ActId = 'abertura' | 'anos' | 'planeta' | 'territorio' | 'telas' | 'fechamento'`
    - `type Act = { id: ActId; label: string; start: number; end: number }`
    - `const ACTS: readonly Act[]` = abertura [0, .03), anos [.03, .20), planeta [.20, .40), territorio [.40, .62), telas [.62, .82), fechamento [.82, 1]
    - `const FILM_HEIGHT_SVH = 700`
  - `<ActSection act={Act} tone={Tone}>`:
    - `<section id={act.id} data-act={act.id}>` com altura `(end - start) * FILM_HEIGHT_SVH` svh;
    - conteúdo em bloco `sticky top-[28svh]`;
    - a seção de abertura soma 100 svh para o hero.
  - `<FilmScroll>`: wrapper `#film` (client) que, nesta task, só renderiza os filhos. A Task 5 liga o ScrollTrigger.
  - `<JsonLd data={object} />`
  - `sitemap()` retorna uma entrada por `ROUTES`, com `url = siteUrl() + path`.

- [ ] **Step 1: Teste que falha**

```ts
// app/sitemap.test.ts
test('sitemap cobre todas as rotas, com URL absoluta', async () => {
  const entries = sitemap()
  expect(entries.map(e => new URL(e.url).pathname).sort()).toEqual(ROUTES.map(r => r.path).sort())
})
```
Run `npm test` → FAIL.

- [ ] **Step 2: Implementar `sitemap.ts`, `robots.ts` (allow all + sitemap) e `opengraph-image.tsx`**

OG: 1200×630, fundo radial `silver-100` → `silver-300`, monograma PNG + "turinq" + tagline. Usa `ImageResponse` de `next/og`. As props são Promise e não são usadas.

Run `npm test` → PASS.

- [ ] **Step 3: Home (`app/page.tsx`)**

- `<FilmScroll>` com 6 `<ActSection>` e a copy da tabela "Textos-chave".
- O hero (dentro da abertura) tem o H1, o sub e os CTAs. O wordmark entra na Task 4.
- Ato 1 mostra `site.stats` como lista HTML; a Task 6 os ancora no 3D, mas a lista continua existindo para leitores de tela.
- Ato 5 mostra `contactChannels(site)`.
- Tons dos atos: abertura e anos `light`, planeta e território `dark`, telas e fechamento `light`.
- JSON-LD `Organization` com `name`, `url`, `logo` e `contactPoint` (telefone WhatsApp). `email` só se existir.

- [ ] **Step 4: Páginas internas e 404**

Cada página interna tem:
- `export const metadata` com title e description vindos de `routeFor(path)`;
- hero de 80 svh com fundo transparente (para o 3D aparecer na Task 10);
- seções de conteúdo com fundo sólido `paper` ou `night` (conforme o tom), cobrindo o canvas.

Conteúdo por página:
- **geotecnologia:** `services.geotecnologia` + `site.gisTools`;
- **sindical:** `services.sindical` + o projeto `area: 'sindical'`;
- **sites-e-sistemas:** `services.sitesESistemas` + todos os `projects`;
- **sobre:** números + processo (diagnóstico → projeto → entrega → suporte) + ano de fundação só se existir;
- **contato:** canais de contato + mensagem pronta do WhatsApp.

`not-found.tsx` usa a copy de 404.

- [ ] **Step 5: Verificar**
  - `npm run check` → verde.
  - Navegar por todas as rotas no preview, sem erro no console.
  - `/xyz` mostra a 404.
  - `curl -s localhost:3000/sitemap.xml` lista 6 URLs.
  - **Teclado:** Tab pela home passa por skip link → nav → CTAs do hero → links dos atos → CTA final, sem foco em elemento invisível.

- [ ] **Step 6: Commit** — `feat: páginas e SEO (site completo sem 3D)`

---

### Task 4: Logo vetorizado (wordmark origami e monograma)

**Files:**
- Create: `scripts/trace-logo.mjs`, `components/brand/subpaths.ts`, `components/brand/wordmark-data.ts` (gerado), `components/brand/monogram-data.ts` (gerado), `components/brand/{Wordmark,Monogram}.tsx`, `app/icon.svg`
- Delete: `app/icon.png` (substituído pelo `icon.svg`)
- Modify: `components/layout/{Header,Footer}.tsx`, `app/page.tsx` (wordmark no hero)
- Test: `components/brand/subpaths.test.ts`

**Interfaces:**
- Produces:
  - `splitSubpaths(d: string): string[]` (corta antes de cada `M`)
  - `subpathXRange(sub: string): [number, number]` (min/max dos x em coordenadas absolutas: os pares numéricos de pontos)
  - `groupByRanges(subs: string[], ranges: [number, number][]): string[]`: junta os subpaths cujo centro x cai em cada faixa e retorna um `d` por faixa
  - Gerado em `wordmark-data.ts`: `const WORDMARK: { height: number; letters: { char: string; d: string; x: number; width: number }[] }`, com `d` transladado para a origem da letra
  - Gerado em `monogram-data.ts`: `const MONOGRAM: { width: number; height: number; d: string }`
  - `<Wordmark animate?: boolean onDone?: () => void className?>`:
    - cada letra é um `<svg>` próprio num container flex com `perspective: 800px`;
    - `fill="currentColor"`, `fill-rule="evenodd"`;
    - se `animate`, GSAP faz cada letra `rotateX: -90 → 0`, `filter: brightness(0.45) → 1`, `transformOrigin: 'top'`, `stagger: 0.08`, `duration: 0.9`, `ease: 'expo.out'`;
    - a tagline `TECNOLOGIA E DESENVOLVIMENTO` (Manrope 700, `tracking-[0.32em]`) entra com fade depois.
  - `<Monogram className?>`: SVG com `fill="currentColor"`.

- [ ] **Step 1: Teste que falha**

```ts
// components/brand/subpaths.test.ts
const d = 'M 10 0 L 20 0 20 10 Z M 12 2 L 18 2 18 8 Z M 50 0 C 55 0, 60 5, 60 10 Z'
test('split e faixa x', () => {
  expect(splitSubpaths(d)).toHaveLength(3)
  expect(subpathXRange(splitSubpaths(d)[2])).toEqual([50, 60])
})
test('agrupa por faixa, preservando furos', () => {
  const groups = groupByRanges(splitSubpaths(d), [[0, 40], [40, 80]])
  expect(groups).toHaveLength(2)
  expect(splitSubpaths(groups[0])).toHaveLength(2)
})
```
Run `npm test` → FAIL.

- [ ] **Step 2: Implementar `subpaths.ts`** → `npm test` PASS.

- [ ] **Step 3: `scripts/trace-logo.mjs`**

- `potrace.trace('public/logo-turinq.png', { threshold: 160, turdSize: 4, optTolerance: 0.2 })`.
- Faixas medidas no PNG (801×233): ícone `[0,240]`, `t [240,330]`, `u [330,420]`, `r [420,490]`, `i [490,540]`, `n [540,635]`, `q [635,740]`.
- Gera `wordmark-data.ts` (6 letras), `monogram-data.ts` e `app/icon.svg` (monograma em `#4E5472`).
- O script importa `../components/brand/subpaths.ts` direto, com a extensão `.ts` (o Node ≥ 22.18 remove os tipos nativamente). Por isso `subpaths.ts` não tem imports nem sintaxe TS que exija transformação (enum, namespace).

Run `npm run trace:logo`. Esperado: o script imprime `6 letras, monograma com N subpaths` (N ≈ 20).

- [ ] **Step 4: Componentes e integração**

- O Header usa `<Monogram>` + texto "turinq".
- O Footer usa `<Wordmark>` estático.
- O hero usa `<Wordmark animate>`. Nesta task ele dispara no mount; a Task 6 passa a disparar no `introDone`.

- [ ] **Step 5: Verificar fidelidade**

No preview, print do hero e do footer lado a lado com `public/logo-turinq.png`: as letras têm as mesmas formas e as frestas do ícone aparecem. Se o traçado deformar alguma letra, ajuste `threshold` / `optTolerance` e gere de novo. **Não redesenhe à mão.** Rodar `npm run check`.

- [ ] **Step 6: Commit** — `feat: logo vetorizado, wordmark origami e monograma`

---

### Task 5: Fundação 3D (store, timeline, qualidade, Stage e fallbacks)

**Files:**
- Create: `lib/store.ts`, `lib/math.ts`, `components/three/film/film-store.ts`, `components/three/quality.ts`, `components/three/{Stage,StageLoader,SceneSwitch,Poster,StageErrorBoundary}.tsx`, `components/three/objects/Dust.tsx`, `components/ui/FilmProgress.tsx`
- Modify: `components/three/film/timeline.ts`, `components/home/FilmScroll.tsx`, `components/layout/Backdrop.tsx`, `app/layout.tsx`
- Leia antes: `02-guides/lazy-loading.md`
- Test: `lib/store.test.ts`, `components/three/film/timeline.test.ts`, `components/three/quality.test.ts`

**Interfaces:**
- Consumes: `ACTS`, `FILM_HEIGHT_SVH`, `sceneForPath`, `toneForPath`, `lerpHex`, `relativeLuminance`, `contrastRatio`, `TOKENS`, `setBackdropColor`, `getLenis`, `useReducedMotion`
- Produces:
  - `lib/math.ts`: `clamp01(x)`, `lerp(a, b, t)`, `smoothstep(e0, e1, x)`, `easeOutExpo(t)`, `easeInOutCubic(t)`, `mulberry32(seed: number): () => number`
  - `lib/store.ts`: `type Store<T> = { get(): T; set(p: Partial<T>): void; subscribe(fn: (s: T) => void): () => void }` e `createStore<T>(initial: T): Store<T>`
  - `film-store.ts`:
    - `type LayerId = 'relevo' | 'hidrografia' | 'lotes' | 'pontos'`
    - `type FilmState = { progress: number; introDone: boolean; pointer: { x: number; y: number }; layers: Record<LayerId, boolean>; camera: { lat: number; lon: number; alt: number } }`
    - `const film: Store<FilmState>`
    - `useFilm<S>(sel: (s: FilmState) => S): S` (via `useSyncExternalStore`)
    - `resetFilm(): void`
    - Só em `NODE_ENV === 'development'`: `window.__turinqFilm = film` e `window.__ScrollTrigger = ScrollTrigger`, para as verificações no navegador.
  - `timeline.ts` (adiciona):
    - `actAt(p): Act`
    - `localProgress(p, id: ActId): number`
    - `backgroundAt(p): string`, com keyframes `[0 → silver100, .17 → silver100, .215 → night, .62 → night, .655 → paper, 1 → paper]`. As transições ficam entre as janelas de texto dos atos (20–80 % de cada ato) para o texto nunca cair sobre cinza intermediário.
    - `toneAt(p): Tone` = `relativeLuminance(backgroundAt(p)) > 0.205 ? 'light' : 'dark'`
    - `textColorFor(t: Tone): string` (light → `ink`, dark → `#FFFFFF`)
    - `timecodeAt(p, totalSec = 90): string` (`"mm:ss"`)
    - `snapProgress(p): number` (ponto médio do ato de `p`)
  - `quality.ts`:
    - `type Quality = 'high' | 'low' | 'static'`
    - `type QualityEnv = { webgl: boolean; forceStatic: boolean; width: number; cores?: number; memory?: number }`
    - `pickQuality(env): Quality`
    - `const QUALITY_SETTINGS: Record<'high' | 'low', { dpr: [number, number]; dust: number; landStride: number; terrainSegments: number }>` = high `{ dpr: [1, 2], dust: 600, landStride: 1, terrainSegments: 256 }`, low `{ dpr: [1, 1], dust: 300, landStride: 2, terrainSegments: 128 }`
    - `detectQualityEnv(search: string): QualityEnv` (só no cliente; `?nowebgl` → `forceStatic`)
  - `<StageLoader/>`: client, `dynamic(() => import('./Stage'), { ssr: false })`, montado no layout entre o Backdrop e o Header.
  - `<Stage/>`:
    - canvas `fixed inset-0 z-0 pointer-events-none aria-hidden`;
    - `gl={{ alpha: true, antialias: quality === 'high' }}`, `dpr` vindo dos settings;
    - `frameloop` = `'never'` quando `document.hidden`;
    - escuta `webglcontextlost` → poster;
    - registra `pointermove` na `window` → `film.pointer` (-1..1).
  - `<SceneSwitch scene={SceneId} quality>`: mapeia `SceneId` → componente de cena. Nesta task, todas as cenas são `<Dust/>`.
  - `<Poster scene tone/>`: gradiente do tom + `<Monogram>` centralizado em 20 % de opacidade.
  - `<FilmProgress/>`:
    - `nav` lateral fixa (desktop) / inferior (mobile), só na home;
    - mostra `timecodeAt` e um `<button>` por ato (exceto abertura);
    - o botão chama `getLenis()?.scrollTo('#'+id)`, com fallback em `scrollIntoView`.
  - `FilmScroll` (atualizado):
    - `useGSAP` cria um ScrollTrigger em `#film` (`start: 'top top'`, `end: 'bottom bottom'`);
    - `onUpdate` → `film.set({ progress })`, `setBackdropColor(backgroundAt(p))` e `document.documentElement.dataset.tone = toneAt(p)`;
    - reduced motion → `progress = snapProgress(p)`;
    - no unmount, `resetFilm()`.

- [ ] **Step 1: Testes que falham**

```ts
// lib/store.test.ts
test('set notifica e get reflete', () => {
  const s = createStore({ a: 1, b: 2 }); const seen: number[] = []
  const off = s.subscribe(v => seen.push(v.a)); s.set({ a: 5 }); off(); s.set({ a: 9 })
  expect(seen).toEqual([5]); expect(s.get()).toEqual({ a: 9, b: 2 })
})

// components/three/film/timeline.test.ts
test('atos cobrem [0,1] sem buracos', () => {
  ACTS.forEach((a, i) => i && expect(a.start).toBe(ACTS[i - 1].end))
  expect(ACTS[0].start).toBe(0); expect(ACTS.at(-1)!.end).toBe(1)
})
test('actAt e localProgress', () => {
  expect(actAt(0).id).toBe('abertura'); expect(actAt(0.3).id).toBe('planeta'); expect(actAt(1).id).toBe('fechamento')
  expect(localProgress(0.30, 'planeta')).toBeCloseTo(0.5)
  expect(localProgress(0.9, 'planeta')).toBe(1)
})
test('fundo e tom nos pontos-chave', () => {
  expect(backgroundAt(0)).toBe('#E9ECF2'); expect(backgroundAt(0.4)).toBe('#0B0E16'); expect(backgroundAt(1)).toBe('#F2F3F6')
  expect([0, 0.3, 0.5, 0.9].map(toneAt)).toEqual(['light', 'dark', 'dark', 'light'])
})
test('act text windows keep AA contrast', () => {
  for (const a of ACTS) {
    const from = a.start + (a.end - a.start) * 0.2, to = a.start + (a.end - a.start) * 0.8
    for (let p = from; p <= to; p += 0.005)
      expect(contrastRatio(textColorFor(toneAt(p)), backgroundAt(p))).toBeGreaterThanOrEqual(4.5)
  }
})
test('timecode e snap', () => {
  expect(timecodeAt(0)).toBe('00:00'); expect(timecodeAt(0.5)).toBe('00:45'); expect(timecodeAt(1)).toBe('01:30')
  expect(snapProgress(0.25)).toBeCloseTo(0.30)
})

// components/three/quality.test.ts
const base = { webgl: true, forceStatic: false, width: 1440, cores: 8, memory: 8 }
test('níveis', () => {
  expect(pickQuality(base)).toBe('high')
  expect(pickQuality({ ...base, width: 767 })).toBe('low')
  expect(pickQuality({ ...base, cores: 4 })).toBe('low')
  expect(pickQuality({ ...base, memory: 4 })).toBe('low')
  expect(pickQuality({ ...base, cores: undefined, memory: undefined })).toBe('high')
  expect(pickQuality({ ...base, webgl: false })).toBe('static')
  expect(pickQuality({ ...base, forceStatic: true })).toBe('static')
})
```
Run `npm test` → FAIL.

**Se o teste de contraste falhar**, não afrouxe o teste: ajuste as janelas de texto (o bloco sticky aparece só entre 20 % e 80 % do ato) ou os keyframes de `backgroundAt`.

- [ ] **Step 2: Implementar `math`, `store`, `film-store`, `timeline` e `quality`** → `npm test` PASS.

- [ ] **Step 3: Implementar `Stage`, `StageLoader`, `SceneSwitch`, `Poster`, `StageErrorBoundary`, `Dust`, `FilmProgress` e ligar o `FilmScroll`**

Dust: `Points` com `QUALITY_SETTINGS[q].dust` partículas em `brand`, deriva lenta e parallax com `film.pointer`.

- [ ] **Step 4: Verificar no preview**
  - Rolar a home: o fundo vai prata → noite → papel, e o header troca de tom.
  - O timecode avança e os botões de ato levam ao ato certo.
  - `?nowebgl` → sem `<canvas>`, poster visível.
  - **Contexto perdido:** `javascript_tool`: `document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()` → o poster aparece e o console fica sem erro não tratado.
  - **Mobile:** `resize_window` preset mobile, rolar até a metade, ler `window.__turinqFilm.get().progress`, redimensionar a altura em ±80 px e ler de novo. A diferença é < 0.01 e `actAt` continua o mesmo.
  - Rodar `npm run check`.

- [ ] **Step 5: Commit** — `feat: fundação 3D com store, timeline, níveis de qualidade e fallbacks`

---

### Task 6: Esfera de facetas e atos 0–1

**Files:**
- Create: `components/three/objects/facets.ts`, `components/three/objects/globe.ts`, `components/three/objects/FacetSphere.tsx`, `components/three/film/frame.ts`, `components/three/film/camera.ts`, `components/three/scenes/FilmScene.tsx`
- Modify: `components/three/SceneSwitch.tsx` (`film` → `FilmScene`), `app/page.tsx` (Wordmark dispara em `introDone`)
- Test: `components/three/objects/facets.test.ts`, `components/three/objects/globe.test.ts`, `components/three/film/frame.test.ts`, `components/three/film/camera.test.ts`

**Interfaces:**
- Consumes: `film`, `ACTS`, `localProgress`, `easeOutExpo`, `mulberry32`, `QUALITY_SETTINGS`
- Produces:
  - `facets.ts`:
    - `type Facet = { a: [number, number, number]; b: [number, number, number]; c: [number, number, number]; centroid: [number, number, number]; normal: [number, number, number] }`
    - `buildFacets(detail: number, gap: number): Facet[]`: faces de `IcosahedronGeometry(1, detail)` não-indexada, cada vértice puxado `gap` em direção ao centroide
    - `facetShade(i: number, seed?: number): 'brand' | 'light' | 'black'`: determinístico, ~70 % / 20 % / 10 %. Cor de `light` = `#8C93AD`.
    - `scatterOffset(i: number, seed: number): [number, number, number]`: posição inicial da faceta solta, raio 3–6
  - `globe.ts` (**sem imports**, porque o script Node da Task 7 importa este arquivo direto): `latLonToVec3(lat: number, lon: number, r: number): [number, number, number]`. Convenção: lon 0 → +z, lat 90 → +y.
  - `frame.ts`:
    - `type FilmFrame = { assemble: number; explode: number; sphereOpacity: number; wireOpacity: number; globeOpacity: number; terrainOpacity: number; layerSpread: number; panelMorph: number; foldBack: number }`
    - `filmFrameAt(p: number, introT: number): FilmFrame`, onde `introT` (0..1) é o progresso da montagem por tempo
    - `introAt(seconds: number): number` = `easeOutExpo(clamp01(seconds / 2.5))`
    - `shouldPlayIntro(progress: number, reducedMotion: boolean): boolean` = `!reducedMotion && progress < 0.03`
  - `camera.ts`:
    - `type CameraPose = { position: [number, number, number]; target: [number, number, number]; fov: number }`
    - `cameraAt(p: number): CameraPose` (keyframes por ato, interpolação `easeInOutCubic`)
    - `globeTransformAt(p: number): { center: [number, number, number]; radius: number; quaternion: [number, number, number, number] }`:
      - até o fim de planeta: centro na origem, raio 1, rotação lenta em y;
      - em território: o quaternion leva (`slerp`) o ponto `latLonToVec3(-22, -43, 1)` até +y, o raio cresce exponencialmente de 1 a 40 (`40 ** t`) e o centro fica em `(0, -radius, 0)`;
      - assim a superfície se achata no plano y = 0, onde o terreno (domínio x, z ∈ [-1, 1]) aparece por crossfade.

      `FacetSphere` e `DotGlobe` aplicam essa transformação.
  - `<FacetSphere frame variant: 'solid' | 'wire'>`:
    - uma única `BufferGeometry` não-indexada com as 80 facetas (240 vértices), posições reescritas a cada quadro e cor por vértice vinda de `facetShade`, com `flatShading` (as facetas geodésicas têm formas diferentes entre si, então `InstancedMesh` não serve);
    - posição de cada faceta = `lerp(scatter, centroid, assemble) + normal * explode * 1.2`;
    - repulsão do cursor: até 0.15 unidades nas facetas próximas do raio do ponteiro;
    - `variant='wire'` usa `LineSegments` em `brandLight`.
  - `<FilmScene>`:
    - lê `film` em `useFrame`;
    - mede o tempo da intro (só se `shouldPlayIntro` no mount; senão `introT = 1` direto);
    - aplica `cameraAt(progress)`;
    - quando `introT` chega a 1, faz `film.set({ introDone: true })` uma vez;
    - mostra os 4 `site.stats` com `<Html>` do drei ancorados em 4 facetas durante `explode > 0.4`, com `aria-hidden` (a lista HTML da Task 3 continua sendo a fonte acessível).

- [ ] **Step 1: Testes que falham**

```ts
// facets.test.ts
test('contagem e gap', () => {
  expect(buildFacets(1, 0)).toHaveLength(80)
  const [f] = buildFacets(1, 0.1)
  const d = Math.hypot(...f.a.map((v, k) => v - f.centroid[k]))
  const [g] = buildFacets(1, 0)
  expect(d).toBeLessThan(Math.hypot(...g.a.map((v, k) => v - g.centroid[k])))
})
test('paleta determinística ~70/20/10', () => {
  const s = Array.from({ length: 1000 }, (_, i) => facetShade(i))
  expect(facetShade(7)).toBe(facetShade(7))
  expect(s.filter(x => x === 'brand').length).toBeGreaterThan(600)
  expect(s.filter(x => x === 'black').length).toBeLessThan(150)
})

// globe.test.ts
test('latLonToVec3', () => {
  expect(latLonToVec3(0, 0, 1).map(v => +v.toFixed(6))).toEqual([0, 0, 1])
  expect(latLonToVec3(90, 0, 2)[1]).toBeCloseTo(2)
  expect(Math.hypot(...latLonToVec3(-22, -43, 1))).toBeCloseTo(1)
})

// frame.test.ts
const keys = ['assemble', 'explode', 'sphereOpacity', 'wireOpacity', 'globeOpacity', 'terrainOpacity', 'layerSpread', 'panelMorph', 'foldBack'] as const
test('valores em [0,1] e contínuos', () => {
  for (let p = 0; p < 1; p += 0.001) {
    const a = filmFrameAt(p, 1), b = filmFrameAt(p + 0.001, 1)
    keys.forEach(k => { expect(a[k]).toBeGreaterThanOrEqual(0); expect(a[k]).toBeLessThanOrEqual(1); expect(Math.abs(a[k] - b[k])).toBeLessThan(0.05) })
  }
})
test('marcos dos atos', () => {
  expect(filmFrameAt(0, 0).assemble).toBe(0)
  expect(filmFrameAt(0, 1)).toMatchObject({ assemble: 1, explode: 0, sphereOpacity: 1 })
  expect(filmFrameAt(0.15, 1).explode).toBeGreaterThan(0.5)
  expect(filmFrameAt(0.35, 1).globeOpacity).toBe(1)
  expect(filmFrameAt(0.55, 1).terrainOpacity).toBe(1)
  expect(filmFrameAt(0.75, 1).panelMorph).toBe(1)
  expect(filmFrameAt(1, 1)).toMatchObject({ foldBack: 1, sphereOpacity: 1 })
})
test('intro só no topo e sem reduced motion', () => {
  expect(shouldPlayIntro(0, false)).toBe(true)
  expect(shouldPlayIntro(0.5, false)).toBe(false)
  expect(shouldPlayIntro(0, true)).toBe(false)
  expect(introAt(0)).toBe(0); expect(introAt(2.5)).toBe(1)
})

// camera.test.ts
test('câmera contínua', () => {
  for (let p = 0; p < 1; p += 0.001) {
    const a = cameraAt(p).position, b = cameraAt(p + 0.001).position
    expect(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])).toBeLessThan(0.15)
  }
})
test('globo contínuo e alvo no topo durante o território', () => {
  for (let p = 0; p < 1; p += 0.001)
    expect(Math.abs(Math.log(globeTransformAt(p + 0.001).radius / globeTransformAt(p).radius))).toBeLessThan(0.1)
  const g = globeTransformAt(0.55)
  const top = new Vector3(...latLonToVec3(-22, -43, 1)).applyQuaternion(new Quaternion(...g.quaternion))
  expect(top.y).toBeCloseTo(1, 2)
  expect(g.center[1]).toBeCloseTo(-g.radius)
})
```
Run `npm test` → FAIL.

- [ ] **Step 2: Implementar `facets.ts`, `globe.ts`, `frame.ts` e `camera.ts`** → PASS.

`filmFrameAt` monta cada campo com `smoothstep` sobre os limites de `ACTS`:
- `explode` sobe em anos e desce no fim de planeta;
- `sphereOpacity` desce em planeta e volta com `foldBack`;
- `wireOpacity` aparece no começo de planeta;
- `globeOpacity` aparece no meio de planeta e some no meio de território;
- `terrainOpacity` aparece no meio de território e some no meio de telas;
- `layerSpread` acontece em território;
- `panelMorph` acontece em telas;
- `foldBack` acontece em fechamento.

Câmera:
- abertura/anos `[0, 0, 4.2]`;
- planeta orbita até `[0, 0.6, 3.2]`;
- território sobe e desce até `[0, 0.9, 1.4]`, olhando para `[0, 0, 0]`. A câmera não troca de espaço: quem se move é o globo (`globeTransformAt`, abaixo);
- telas recua até `[0, 1.5, 6]`;
- fechamento `[0, 0, 4.2]`.

- [ ] **Step 3: Implementar `FacetSphere` e `FilmScene`, e ligar o Wordmark ao `introDone`**

- [ ] **Step 4: Verificar no preview**
  - Recarregar a home: as facetas voam e montam a esfera em cerca de 2,5 s e, depois, o "turinq" se desdobra.
  - Mover o mouse: a esfera inclina e as facetas fogem do cursor.
  - Rolar até 15 %: vista explodida com os 4 números.
  - **Review Focus 1:** rolar até a metade, recarregar → a cena aparece no ato daquele ponto, sem montagem e sem flash do ato 0.
  - Print dos atos 0 e 1. Rodar `npm run check`.

- [ ] **Step 5: Commit** — `feat: esfera de facetas, abertura e vista explodida`

---

### Task 7: Globo de pontos e ato 2

**Files:**
- Create: `scripts/build-land-points.mjs`, `public/data/land-points.json` (gerado), `components/three/objects/DotGlobe.tsx`
- Modify: `components/three/objects/globe.ts` (adiciona `fibonacciSphere`, ainda sem imports), `components/three/scenes/FilmScene.tsx`
- Test: `components/three/objects/globe.test.ts`

**Interfaces:**
- Consumes: `latLonToVec3`, `globeTransformAt`, `FilmFrame` (Task 6)
- Produces:
  - `fibonacciSphere(n: number): [number, number][]`: pares `[lat, lon]` em graus
  - `land-points.json`: `{ points: number[] }`, achatado `[lat, lon, …]` com 2 casas, gerado com `n = 16000` pontos de Fibonacci filtrados por `geoContains(feature(land-110m, land))`
  - `<DotGlobe frame stride>`:
    - `Points` dos continentes em `brandLight` com brilho aditivo;
    - grade de latitude/longitude a cada 15° em `LineSegments` com opacidade 0.15;
    - opacidade = `frame.globeOpacity`; carrega o JSON via `fetch` só quando a cena `film` ou `globe` monta.

- [ ] **Step 1: Teste que falha**

```ts
test('fibonacciSphere distribui no intervalo', () => {
  const pts = fibonacciSphere(1000)
  expect(pts).toHaveLength(1000)
  pts.forEach(([la, lo]) => { expect(Math.abs(la)).toBeLessThanOrEqual(90); expect(lo).toBeGreaterThanOrEqual(-180); expect(lo).toBeLessThan(180) })
})
```
Run `npm test` → FAIL.

- [ ] **Step 2: Implementar `globe.ts`** → PASS.

- [ ] **Step 3: Script e geração**

Run `npm run build:land`. Esperado: o script imprime `N pontos de terra` (≈ 4–5 mil) e o arquivo fica com menos de 80 KB. A licença do Natural Earth (domínio público) vai num comentário no topo do script.

- [ ] **Step 4: `DotGlobe` na `FilmScene`**

A esfera passa a wire e o globo acende no ato 2. O globo aplica `globeTransformAt(progress)`; no território ele cresce sob a câmera.

- [ ] **Step 5: Verificar** — print em 30 % (globo noturno com o Brasil visível), console limpo. Rodar `npm run check`.

- [ ] **Step 6: Commit** — `feat: globo noturno de pontos (ato 2)`

---

### Task 8: Território, camadas GIS e ato 3

**Files:**
- Create: `components/three/objects/terrain.ts`, `components/three/objects/{Terrain,GisLayers}.tsx`, `components/ui/{LayerPanel,Hud}.tsx`
- Modify: `components/three/scenes/FilmScene.tsx`, `app/page.tsx` (LayerPanel e Hud na seção `territorio`), `components/three/film/film-store.ts` (`toggleLayer`), `components/three/film/camera.ts` (`hudAt`)
- Test: `components/three/objects/terrain.test.ts`, `components/three/film/film-store.test.ts`, `components/three/film/camera.test.ts`

**Interfaces:**
- Consumes: `film`, `FilmFrame`, `mulberry32`, `QUALITY_SETTINGS.terrainSegments`
- Produces:
  - `heightAt(x: number, z: number, seed?: number): number`: value noise fBm com 4 oitavas, determinístico, retorno em [0, 1], domínio `x, z ∈ [-1, 1]`
  - `traceRiver(start: [number, number], steps: number, seed?: number): [number, number][]`: descida pelo gradiente de `heightAt`, passo 0.01, para em mínimo local
  - `toggleLayer(id: LayerId): void`
  - `<Terrain frame segments>`:
    - `PlaneGeometry` deslocada na CPU por `heightAt`, com atributo `height`;
    - shader de curvas de nível: `fract(height * 18.0)` com `fwidth` para antialias, linhas em `gis` sobre base `nightSurface`;
    - opacidade `frame.terrainOpacity`.
  - `<GisLayers frame>`: 4 grupos, todos separados no eixo y por `layerSpread * 0.35`:
    - `relevo`: cópia do Terrain em wireframe;
    - `hidrografia`: 6 rios de `traceRiver` em `Line`, cor `#5FA8D3`;
    - `lotes`: grade de polígonos em `EdgesGeometry` na área plana;
    - `pontos`: 24 instâncias com pulso.

    A visibilidade de cada grupo vem de `film.layers[id]`.
  - `<LayerPanel>`: 4 `<button aria-pressed>` com os nomes das camadas (copy), chamando `toggleLayer`.
  - `hudAt(p: number): { lat: number; lon: number; alt: number }`, em `camera.ts`:
    - antes do território: lat/lon do ponto do globo sob a câmera (desfazendo o `globeTransformAt`);
    - no território: lat −22 / lon −43 deslocados por `cameraAt(p).position.x / .z × 1°`;
    - `alt` = distância da câmera à superfície × 6371 km quando o raio é 1, e em metros no território (`position.y × 1000`).
  - `<Hud>`: `font-mono` com `lat`, `lon` e `alt` de `film.camera`. O `FilmScene` grava `hudAt(progress)` no store só quando lat/lon mudam na 2ª casa decimal, para não renderizar a cada quadro.

- [ ] **Step 1: Testes que falham**

```ts
// terrain.test.ts
test('heightAt determinístico e limitado', () => {
  expect(heightAt(0.3, -0.2)).toBe(heightAt(0.3, -0.2))
  for (let i = 0; i < 500; i++) { const h = heightAt(Math.random() * 2 - 1, Math.random() * 2 - 1); expect(h).toBeGreaterThanOrEqual(0); expect(h).toBeLessThanOrEqual(1) }
})
test('rio só desce', () => {
  const r = traceRiver([0.4, 0.4], 200)
  expect(r.length).toBeGreaterThan(5)
  for (let i = 1; i < r.length; i++) expect(heightAt(...r[i])).toBeLessThanOrEqual(heightAt(...r[i - 1]) + 1e-9)
})

// camera.test.ts (adiciona)
test('HUD no território fica perto do alvo', () => {
  const h = hudAt(0.55)
  expect(Math.abs(h.lat + 22)).toBeLessThan(1); expect(Math.abs(h.lon + 43)).toBeLessThan(1)
})

// film-store.test.ts
test('toggleLayer alterna só a camada pedida', () => {
  resetFilm(); toggleLayer('lotes')
  expect(film.get().layers).toEqual({ relevo: true, hidrografia: true, lotes: false, pontos: true })
})
```
Run `npm test` → FAIL.

- [ ] **Step 2: Implementar `terrain.ts` e `toggleLayer`** → PASS.

- [ ] **Step 3: `Terrain`, `GisLayers`, `LayerPanel` e `Hud`; integrar na `FilmScene` e na seção do ato 3**

- [ ] **Step 4: Verificar**
  - Em 50 %: relevo com curvas acesas e camadas se separando.
  - Clicar em "Lotes": a camada some e o botão fica com `aria-pressed="false"`. Funciona também via teclado (Tab + Enter).
  - O HUD muda durante o mergulho.
  - Print. Rodar `npm run check`.

- [ ] **Step 5: Commit** — `feat: território com curvas de nível e camadas GIS (ato 3)`

---

### Task 9: Painéis de telas e atos 4–5

**Files:**
- Create: `components/three/objects/panels.ts`, `components/three/objects/screens.ts`, `components/three/objects/ScreenPanels.tsx`
- Modify: `components/three/scenes/FilmScene.tsx`
- Test: `components/three/objects/panels.test.ts`

**Interfaces:**
- Produces:
  - `type ScreenKind = 'site' | 'portal' | 'erp' | 'app'`
  - `type PanelPose = { position: [number, number, number]; rotation: [number, number, number]; scale: number }`
  - `panelPose(i: number, n: number, morph: number, fold: number): PanelPose`:
    - `morph = 0`: plano horizontal empilhado (y = i × 0.35, igual às camadas);
    - `morph = 1`: em pé, num arco de raio 3 e 100° de abertura, voltados para a câmera;
    - `fold = 1`: `scale = 0` no centro.
  - `drawScreen(ctx: CanvasRenderingContext2D, kind: ScreenKind, w: number, h: number): void`: mock de interface em wireframe nas cores da marca. Mostra só títulos genéricos: "Notícias", "Filiação", "Financeiro", "Rastreamento". Nenhum nome de cliente.
  - `<ScreenPanels frame>`: 4 planos com `CanvasTexture` (512×320, gerada 1 vez por tipo), `MeshBasicMaterial({ transparent: true, opacity: 0.92 })` e borda em `LineSegments` `brandLight`. A pose vem de `panelPose`.
  - No fechamento, `FacetSphere` volta com `assemble` dirigido por `foldBack`: os triângulos saem da posição dos painéis.

- [ ] **Step 1: Teste que falha**

```ts
test('poses nos extremos', () => {
  expect(panelPose(2, 4, 0, 0).position[1]).toBeCloseTo(0.7)
  expect(panelPose(2, 4, 0, 0).rotation[0]).toBeCloseTo(-Math.PI / 2)
  const p = panelPose(0, 4, 1, 0), q = panelPose(3, 4, 1, 0)
  expect(Math.hypot(p.position[0], p.position[2])).toBeCloseTo(3)
  expect(p.position[0]).toBeLessThan(0); expect(q.position[0]).toBeGreaterThan(0)
  expect(panelPose(1, 4, 1, 1).scale).toBe(0)
})
```
Run `npm test` → FAIL.

- [ ] **Step 2: Implementar `panels.ts`** → PASS.

- [ ] **Step 3: `screens.ts`, `ScreenPanels` e o fechamento na `FilmScene`**

- [ ] **Step 4: Verificar** — prints em 72 % (painéis em arco, fundo clareando) e em 100 % (esfera remontada sobre papel, CTA legível). O plano-sequência inteiro roda sem corte visível, de cima a baixo. Rodar `npm run check`.

- [ ] **Step 5: Commit** — `feat: painéis de telas e fechamento (atos 4 e 5)`

---

### Task 10: Cenas das páginas internas e transição de facetas

**Files:**
- Create: `components/three/scenes/{TerrainScene,PanelsScene,SphereScene,GlobeScene}.tsx`, `components/layout/{TransitionLink,PageTransition}.tsx`, `components/layout/facet-grid.ts`
- Modify: `components/three/SceneSwitch.tsx`, `components/layout/{Header,Footer}.tsx` e links internos (`next/link` → `TransitionLink`), `app/layout.tsx`
- Test: `components/layout/facet-grid.test.ts`, `components/three/objects/globe.test.ts` (adiciona `randomLatLon`)

**Interfaces:**
- Consumes: `Terrain`, `GisLayers`, `ScreenPanels`, `FacetSphere`, `DotGlobe`, `useReducedMotion`, `mulberry32`
- Produces:
  - `facetGrid(cols: number, rows: number): { points: string; delay: number }[]`: 2 triângulos por célula, `points` em % para `<polygon>`, `delay` crescente na diagonal (0..1)
  - `randomLatLon(rng: () => number): [number, number]`, em `globe.ts`
  - Cenas internas, cada uma com `frame` fixo e câmera própria, sem scroll:
    - `TerrainScene`: o ponteiro desloca uma faixa de brilho sobre as curvas (uniform `uScan`);
    - `PanelsScene`: `panelMorph = 1` com rotação lenta;
    - `SphereScene`: `assemble = 1`, rotação lenta, segue o ponteiro;
    - `GlobeScene`: globo + pin pulsante em `randomLatLon(Math.random)`, com a coordenada exibida no texto da 404.
  - `<TransitionLink href>`:
    - clique interno sem modificadores → `await cover()` → `router.push(href)`;
    - com reduced motion, se comporta como `Link`.
  - `<PageTransition>`: overlay SVG `fixed z-50` com `facetGrid(12, 7)` em `night`, `aria-hidden`.
    - O módulo exporta `cover(): Promise<void>`: os triângulos entram em 450 ms. A função usa uma ref de módulo para o overlay montado e resolve na hora se ele não estiver montado.
    - Faz `uncover` sozinho quando o pathname muda: os triângulos saem em 550 ms.

- [ ] **Step 1: Testes que falham**

```ts
test('facetGrid', () => {
  const g = facetGrid(12, 7)
  expect(g).toHaveLength(168)
  expect(g[0].delay).toBe(0); expect(Math.max(...g.map(t => t.delay))).toBe(1)
})
test('randomLatLon dentro do globo', () => {
  const rng = mulberry32(1)
  for (let i = 0; i < 100; i++) { const [la, lo] = randomLatLon(rng); expect(Math.abs(la)).toBeLessThanOrEqual(90); expect(Math.abs(lo)).toBeLessThanOrEqual(180) }
})
```
Run `npm test` → FAIL.

- [ ] **Step 2: Implementar `facet-grid.ts` e `randomLatLon`** → PASS.

- [ ] **Step 3: Cenas, `SceneSwitch` completo, `TransitionLink` e `PageTransition`**

- [ ] **Step 4: Verificar**
  - Navegar por todas as páginas: a transição de facetas cobre e revela a tela, e o canvas não pisca (o mesmo `<canvas>` continua no DOM).
  - Cada página mostra a cena certa e a 404 mostra o pin e a coordenada.
  - **Review Focus 2:** em `/`, ler `window.__ScrollTrigger.getAll().length` (Task 5, só em dev) → navegar `/sobre` → `/` → o valor é o mesmo da primeira leitura e `window.__turinqFilm.get().progress === 0`.
  - Rodar `npm run check`.

- [ ] **Step 5: Commit** — `feat: cenas das páginas internas e transição de facetas`

---

### Task 11: Movimento reduzido, desempenho e acabamento

**Files:**
- Modify: os componentes que já existem, conforme os achados. Nenhum arquivo novo é previsto.

- [ ] **Step 1: Movimento reduzido**

Abrir a home e uma página interna com `?motion=reduce` (Task 2). Conferir:
- sem Lenis;
- a home mostra quadros fixos por ato (`snapProgress`) com fade;
- a intro não roda (esfera já montada);
- a transição de página não aparece;
- o `Reveal` mostra o texto direto.

- [ ] **Step 2: Desempenho**
  - `npm run build` e anotar o tamanho dos chunks da home. O 3D precisa estar num chunk separado do JS inicial.
  - Confirmar que o LCP é o H1: no preview, `PerformanceObserver` para `largest-contentful-paint` → o elemento é `h1`.
  - Confirmar a pausa com a aba oculta (`frameloop`).
  - No nível `low`, `QUALITY_SETTINGS.low` é de fato aplicado: forçar `?quality=low` só em dev, se ajudar.

- [ ] **Step 3: Lighthouse mobile**

Medir antes (o `main`, buildado num clone no scratchpad) e depois (este branch), os dois via `next start`:
```bash
npx -y lighthouse@12 http://localhost:3000 --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=<scratchpad>/lh-<antes|depois>.json --chrome-flags="--headless=new"
```
Metas: Performance ≥ 85, Acessibilidade = 100, Boas práticas = 100, SEO = 100. Abaixo da meta: corrigir a causa apontada no relatório e medir de novo.

- [ ] **Step 4: Commit** — `perf: ajustes de movimento reduzido e desempenho` (se houver mudanças)

---

### Task 12: Verificação final e PR

- [ ] **Step 1:** `npm run check` → lint, typecheck, testes e build verdes. Colar o resumo do Vitest (N testes passando).
- [ ] **Step 2:** No preview, prints em desktop e mobile de: atos 0–5, cada página interna, 404, `?nowebgl`. Enviar ao Lucas.
- [ ] **Step 3:** `git grep -n "TODO(Lucas)"`. A lista vai para o corpo do PR.
- [ ] **Step 4:** Atualizar o `README.md`: o que é, stack, `npm run dev` / `check` / `trace:logo` / `build:land`, onde ficam os dados (`content/`) e deploy na Vercel (importar o repo; `NEXT_PUBLIC_SITE_URL` opcional).
- [ ] **Step 5:** `git push -u origin redesign/v2` e `gh pr create --base main` com o resumo, a tabela do Lighthouse antes × depois, os TODOs e o rodapé de atribuição.
