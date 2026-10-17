# Turinq — site institucional

Site da Turinq (Tecnologia e Desenvolvimento): sites, sistemas, área sindical e geotecnologia.
A home é um plano-sequência 3D guiado pelo scroll: a esfera do logo se monta, vira um globo
noturno, mergulha no território com camadas GIS e termina nas telas de sites e sistemas.

## Stack

- Next.js 16 (App Router, páginas estáticas) · React 19 · TypeScript · Tailwind CSS 4
- three.js + React Three Fiber para o 3D (um canvas único, mantido entre as rotas)
- Lenis (scroll suave) e GSAP SplitText (revelação de texto), ambos carregados no tempo ocioso
- Vitest para as funções puras (timeline do filme, câmera, geometria, conteúdo)

## Comandos

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # lint + tipos + testes + build (rode antes de cada commit)
npm run trace:logo   # regera o wordmark/monograma em SVG a partir de public/logo-turinq.png
npm run build:land   # regera public/data/land-points.json (continentes do globo, Natural Earth)
```

Para verificar sem mexer no sistema: `?motion=reduce` simula movimento reduzido e `?nowebgl`
força a versão sem 3D.

## Onde ficam as coisas

- `content/` — textos e fatos da empresa (números, projetos, serviços, rotas). Campos `null` são
  dados ainda não confirmados (`TODO(Lucas)` em `content/site.ts`) e os componentes simplesmente
  não mostram o item.
- `components/three/film/` — o roteiro do filme: atos (`timeline.ts`), estado de cada objeto por
  progresso (`frame.ts`) e câmera/globo (`camera.ts`). Tudo função pura e testada.
- `components/three/objects/` — esfera de facetas, globo de pontos, relevo, camadas GIS, painéis.
- `components/three/scenes/` — a cena de cada rota (`content/routes.ts` diz qual).
- `docs/superpowers/` — spec e plano de implementação do redesign.

## Deploy na Vercel

Importe o repositório na Vercel; o Next é detectado sozinho, sem `vercel.json`. Opcional:
defina `NEXT_PUBLIC_SITE_URL` com o domínio final (sem ele, sitemap e metadados usam o domínio
de produção da Vercel).
