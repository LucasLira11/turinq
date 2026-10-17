# Site Turinq v2 — Design

- **Data:** 2026-10-17
- **Status:** aprovado em conversa (5 seções); aguardando revisão desta spec
- **Repo:** `LucasLira11/turinq`, branch `redesign/v2` → PR para `main` → deploy na Vercel

## 1. Objetivo

Substituir o site atual (Next.js de uma página, tema escuro azul/violeta genérico) por um site institucional que cause impacto imediato ("krl, que foda") e deixe claro o diferencial da Turinq:

- mais de 20 anos de mercado;
- de sites institucionais a sistemas geográficos;
- atuação na área **sindical**;
- **geotecnologia** com ArcGIS e plataformas baseadas em GIS.

**Público:** diretorias de sindicatos, órgãos públicos e ambientais, empresas que precisam de GIS, empresas que querem site ou sistema sob medida.

**Sucesso:**
1. O hero 3D impressiona nos primeiros segundos.
2. Em uma rolagem o visitante entende "fazem GIS + atendem sindicatos + fazem sites e sistemas".
3. O caminho até o WhatsApp é curto em qualquer página.

## 2. Regras de conteúdo

- Não inventar fatos. Texto de marketing é escrito por nós; **fatos** só entram se confirmados.
- **Confirmados pelo Lucas (podem ser usados):**
  - 20+ anos de mercado
  - 15+ projetos entregues
  - 98% de satisfação dos clientes
  - 5+ especialistas
  - Projetos: sistema ERP (finanças, afiliações, módulos administrativos); portal institucional com publicações e notícias diárias; app mobile de rastreamento de transportes com IA
  - WhatsApp: `+55 22 99779-3222` (`https://wa.me/5522997793222`)
- **Cases sem nome de cliente** — descritos pelo tipo ("Portal para sindicato de servidores federais").
- Recursos da área sindical (portal com notícias e editor próprio, filiação online, convênios, migração de WordPress) são capacidades já entregues; aparecem sem citar o cliente.
- **`TODO(Lucas)`** — tudo concentrado em `content/site.ts`:
  - e-mail de contato
  - endereço / cidade
  - redes sociais
  - ano de fundação
  - ferramentas GIS específicas além de "ArcGIS" (ArcGIS Pro / Online / Enterprise, QGIS etc.)
- Um TODO nunca é renderizado como texto falso: o componente omite o item (ex.: sem e-mail → o botão de e-mail não aparece).

## 3. Experiência da home — plano-sequência

Um único canvas WebGL fixo atrás do conteúdo, câmera contínua, sem cortes. O texto é HTML real sobreposto (acessível e indexável). Na lateral, uma barra estilo player de vídeo mostra **timecode + nome do ato** e o progresso.

| Ato | Scroll | Cena | Texto sobreposto | Fundo |
|---|---|---|---|---|
| 0 · Abertura | ao carregar (~2,5 s, independe do scroll) | Poeira flutuando sobre radial prata; triângulos soltos se atraem e **montam a esfera geodésica do logo**; o wordmark "turinq" **se desdobra como origami** letra a letra; a esfera segue o mouse e as facetas se afastam do cursor | headline + "role" | prata `#E9ECF2→#C9CED9` |
| 1 · 20+ anos | 0–20% | A esfera gira e **se abre em camadas** (vista explodida); os 4 números ficam ancorados nas facetas | números | transição para noite |
| 2 · Planeta | 20–40% | As facetas se subdividem e viram **globo noturno**: continentes em pontos de luz, grade lat/long | Geotecnologia — ArcGIS e plataformas GIS | noite `#0B0E16` |
| 3 · Território | 40–62% | Mergulho no Sudeste do Brasil; o globo vira **relevo 3D com curvas de nível acesas**; **camadas GIS** sobem empilhadas (relevo, hidrografia, lotes, pontos); **painel de camadas clicável** liga/desliga cada uma ao vivo; HUD mono com as coordenadas da câmera | o que fazemos com GIS | noite |
| 4 · Telas | 62–82% | As camadas giram e viram **painéis de vidro**, cada um com uma tela: site institucional, portal sindical, sistema de gestão, app | sites, sistemas, sindical (cases sem nome) | clareando |
| 5 · Fechamento | 82–100% | Os painéis se dobram em triângulos e **remontam a esfera do logo** | CTA WhatsApp + e-mail | papel `#F2F3F6` |

**Fora do escopo:** som/áudio.

## 4. Páginas

| Rota | Conteúdo | Cena 3D do topo |
|---|---|---|
| `/` | Plano-sequência (seção 3) | `film` |
| `/geotecnologia` | ArcGIS e plataformas GIS: mapas web interativos, geoprocessamento, painéis geográficos, sistemas com base GIS | `terrain` (relevo; o mouse "escaneia" as curvas) |
| `/sindical` | Portal institucional com notícias e editor próprio, filiação online, convênios, migração de sites antigos | `panels` |
| `/sites-e-sistemas` | Sites institucionais, sistemas sob medida (ERP), apps mobile; os 3 projetos confirmados | `panels` (facetas formando telas) |
| `/sobre` | 20+ anos, números, processo (diagnóstico → projeto → entrega → suporte) | `sphere` |
| `/contato` | WhatsApp com mensagem pronta + e-mail (`mailto:`) | `sphere` (pequena) |
| 404 | "Coordenada não encontrada" | `globe` marcando uma lat/long sorteada a cada visita |

- **Comum:** header (monograma + nav + CTA WhatsApp), footer (logo completo, nav, contatos, ©).
- **SEO:** `metadata` por página, imagem OG gerada com o logo, `sitemap.xml`, `robots.txt`, JSON-LD `Organization`. Idioma: só pt-BR.

## 5. Identidade visual

### Logo
- **Wordmark:** vetorizar o PNG oficial (`public/logo-turinq.png`) em SVG por traçado automático, sem redesenhar; separar cada letra em um path para animar o desdobrar origami (rotação 3D por letra + gradiente de dobra). Se o traçado não ficar fiel, usar o PNG recortado por letra.
- **Esfera 3D:** icosaedro geodésico com faces separadas (cada triângulo encolhido para o próprio centroide, criando a fresta branca do logo), sombreamento flat; proporção de cores do ícone: maioria `#4E5472`, algumas claras, poucas pretas.
- **Esfera noturna:** só as arestas, em `#8FA3C7` (atos escuros).
- **Monograma:** a esfera sozinha (favicon, header).
- **Faceta como grafismo:** bullets, divisórias e a **transição entre páginas** (triângulos cobrem a tela e se abrem na nova rota).
- **Sem loader separado:** a montagem da esfera é o próprio carregamento.

### Tipografia (via `next/font`, auto-hospedada)
- **Unbounded:** títulos
- **Manrope:** texto
- **JetBrains Mono:** timecode, coordenadas, rótulos de camada

### Cores
| Token | Valor | Uso |
|---|---|---|
| `silver-100` / `silver-300` | `#E9ECF2` / `#C9CED9` | abertura |
| `paper` | `#F2F3F6` | fechamento, páginas claras |
| `brand` | `#4E5472` | marca (cor dominante do logo) |
| `brand-light` | `#8FA3C7` | realces, linhas no escuro |
| `steel` | `#3F6A8A` | azul-aço do wordmark |
| `night` / `night-surface` | `#0B0E16` / `#121725` | atos escuros |
| `ink` | `#1A1D29` | texto no claro |
| `gis` | `#7FD1C7` | acento pontual: pins, curvas acesas, foco |

Todo texto precisa de contraste AA.

### Movimento
- Textos revelados linha a linha por máscara; easing expo-out.
- Nada pisca ou fica em loop chamando atenção — o impacto vem do 3D.

## 6. Arquitetura

### Stack
- **Mantém:** Next.js 16 (App Router, páginas estáticas), React 19, Tailwind 4, lucide-react.
- **Tailwind 4 configurado no CSS** (`@theme`); remover `tailwind.config.js` e o `postcss.config.js` duplicado.
- **Entram:** `three`, `@react-three/fiber`, `@react-three/drei` (só os helpers usados), `gsap` (+ ScrollTrigger), `lenis`.
- **Saem:** `framer-motion`.
- **Dev:** `vitest`; para o script dos continentes, `world-atlas` + `topojson-client` + `d3-geo` (só em desenvolvimento).
- `AGENTS.md`: antes de escrever código Next, ler o guia relevante em `node_modules/next/dist/docs/` (Next 16 tem mudanças incompatíveis).

### Canvas persistente
- O `<Stage>` mora no `app/layout.tsx`. Na troca de rota a cena muda (com a transição de facetas) **sem recriar o contexto WebGL** — a continuidade vale para o site inteiro.
- Cada página declara a cena: `film | terrain | panels | sphere | globe`.
- Carregado com import dinâmico só no cliente, em chunk separado.

### Fluxo de dados
- Lenis → ScrollTrigger (marcadores `data-act` na home) → um `progress` (0–1) + `act` num store mínimo baseado em ref (sem re-render React).
- `useFrame` de cada objeto lê o store e calcula o estado por **funções puras** `stateAt(progress)` em `components/three/film/timeline.ts`, testáveis sem navegador.

### Estrutura
```
app/                   rotas, layout, sitemap.ts, robots.ts, opengraph-image, not-found
components/layout/     Header, Footer, PageTransition, SmoothScroll
components/brand/      Wordmark (letras SVG + origami), Monogram
components/ui/         Button, Reveal, FilmProgress, FacetBullet
components/three/      Stage, CameraRig, quality.ts
  objects/             FacetSphere, DotGlobe, Terrain, GisLayers, ScreenPanels, Dust
  film/timeline.ts     atos, intervalos, stateAt()
content/               site.ts (empresa, contatos, números, TODOs), services.ts, projects.ts
scripts/               build-land-points.mjs (Natural Earth 110m, domínio público)
public/data/           land-points.json (gerado e versionado, poucos KB)
public/brand/          SVGs do logo
```

### Níveis de qualidade (`quality.ts`)
- **Alto:** DPR até 2, partículas e pontos completos.
- **Baixo:** DPR 1, metade das partículas/pontos, relevo com menos vértices. Escolhido se `innerWidth < 768` **ou** `hardwareConcurrency ≤ 4` **ou** `deviceMemory ≤ 4`.
- **Estático:** sem WebGL, contexto perdido, erro no canvas ou `?nowebgl` → poster: o fundo (gradiente) do ato/cena + monograma SVG estático. Sem imagens renderizadas.
- **Animações reduzidas** (`prefers-reduced-motion`): sem câmera atrelada ao scroll; cada ato é um quadro fixo com fade; sem Lenis.

### Desempenho
- O LCP é o título HTML, não o canvas; o 3D carrega após a hidratação.
- Render pausa com a aba oculta.
- Meta Lighthouse mobile: Performance ≥ 85, Acessibilidade 100, Boas práticas 100, SEO 100.

### Erros e acessibilidade
- Error boundary no canvas e handler de `webglcontextlost` → poster estático.
- Canvas com `aria-hidden`; todo conteúdo existe como texto no DOM.
- Painel de camadas com `<button>` reais (teclado, `aria-pressed`).
- Foco visível no acento `gis`.

## 7. Verificação

- `npm run check` = lint + `tsc --noEmit` + `vitest run` + `next build`.
- **Testes unitários:** `stateAt()` da timeline (limites e continuidade entre atos), seleção de nível de qualidade, integridade do conteúdo (sem link vazio; TODO não renderizado).
- **Navegador (painel de preview):** desktop e mobile, cada ato com print, `prefers-reduced-motion`, `?nowebgl`, navegação entre páginas.
- **Lighthouse mobile:** site atual × novo, números lado a lado.

## 8. Entrega

- Commits pequenos por fase no branch `redesign/v2`:
  1. base (tokens, fontes, layout, conteúdo, páginas só com texto — site funcional sem 3D)
  2. logo
  3. canvas + atos 0–1
  4. atos 2–3
  5. ato 4–5 + cenas internas + transição
  6. versões leves, desempenho, SEO
  7. verificação
- Push do branch e PR para `main` em `LucasLira11/turinq`, com a lista dos `TODO(Lucas)`.
- Vercel: importar o repo; detecção automática do Next, sem `vercel.json`.
