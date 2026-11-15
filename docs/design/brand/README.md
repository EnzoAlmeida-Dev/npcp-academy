# NPCP Academy — Logo "Build"

## Cores
- Grafite (base escura): `#1C1D21`
- Vermelho (acento): `#B81825`
- Branco: `#FFFFFF`

Ambas extraídas diretamente da plataforma atual (tela de login), então já batem 100% com o que existe hoje.

## O que tem em cada pasta

### `wordmark/`
Logo completa "NPCP Academy", com o símbolo no lugar do "A" de Academy.
Texto convertido em contorno vetorial (não depende de nenhuma fonte instalada).
- `npcp-academy-wordmark-dark-text.svg` — texto escuro, para fundos claros
- `npcp-academy-wordmark-white-text.svg` — texto branco, para fundos escuros
- PNGs em alta resolução (@1200 e @2400px de largura) das duas versões, fundo transparente

### `icon/`
O símbolo sozinho, sem o texto — para avatar, ícone de app, redes sociais etc.
- `npcp-icon-tile-dark.svg` — símbolo dentro do tile arredondado escuro (uso padrão)
- `npcp-icon-square-dark.svg` — mesmo conteúdo, cantos retos, de borda a borda (para favicon e contextos que aplicam a própria máscara, como ícones de app no iOS/Android)
- `npcp-icon-standalone-dark.svg` / `npcp-icon-standalone-white.svg` — só as formas do símbolo, sem fundo nenhum (para colocar sobre qualquer cor/imagem)
- PNGs exportados em 16 a 1024px

### `favicon/`
Pronto para subir na raiz do site.
- `favicon.ico` — multi-tamanho (16, 32, 48, 64px), o arquivo clássico de favicon
- `favicon-16x16.png`, `favicon-32x32.png` — tamanhos padrão de navegador
- `apple-touch-icon.png` (180×180) — ícone quando salvam o site na tela do iPhone
- `android-chrome-192x192.png`, `android-chrome-512x512.png` — ícones Android/PWA
- `head-snippet.html` — trecho pronto para colar dentro da tag `<head>` do site

## Uso rápido
- Dentro da plataforma (fundo branco): use a wordmark de texto escuro, ou o símbolo sozinho em cima de uma superfície clara.
- Nas telas escuras (como a tela de login atual): use a wordmark de texto branco.
- Tamanho mínimo recomendado para a wordmark completa: 120px de largura (abaixo disso, prefira só o símbolo).
- Não recolorir o traço vermelho — ele é o elemento de identidade da marca, deve se manter sempre `#B81825`.
