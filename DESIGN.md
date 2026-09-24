# DESIGN.md · Madu

Ficha de direção do site. Vale para toda tela nova. Desenho aprovado no canvas "Madu · Site" (Claude Design).

**Direção C · Mostruário.** A loja é a bandeja de um mostruário de semijoias, onde cada coisa tem o seu compartimento.

## Logo
- Fundo claro: `public/brand/madu-logo-principal-rosa.svg` (rosa queimado)
- Fundo rosa queimado ou cacau: `public/brand/madu-logo-principal-nude.svg`
- Nunca usar a versão cacau no site. Nunca redesenhar o logo em fonte.

## Cores (tokens em `src/app/(frontend)/styles.css`)
| Token | Hex | Uso |
|---|---|---|
| `--papel` | #FBF6F1 | fundo de página |
| `--cacau` | #3B2A24 | texto; fundo do rodapé |
| `--rosa` | #9A4F4B | logo, bandeja do topo, botão principal, "Ver tudo" |
| `--bandeja-casa` | #8A4643 | casa da bandeja |
| `--bandeja-divisoria` | #6E3432 | filete da bandeja; hover do botão principal |
| `--nude` | #EBDACB | logo sobre fundo escuro |
| `--foto-vazia` | #E2CDBD | espaço de foto sem imagem |
| `--linha` | #D9C3B3 | filetes de 1px |
| `--texto-2` | #6E5044 | texto secundário, rótulos |
| `--terracota` | #B8643F | preços (destaque único) |

## Tipografia
- Títulos: Marcellus, caixa alta, `letter-spacing: 0.04em`, entrelinha 1.08 a 1.1
- Corpo: Figtree (variável), entrelinha 1.7, medida máxima ~65 caracteres
- Rótulos: Figtree 500, 12px, caixa alta, `+0.16em`
- Nome de categoria: Marcellus 14 a 16px, caixa alta, `+0.12em`
- Escala 1.333 a partir de 16px: 12 · 16 · 21 · 28 · 38 · 50 (celular: h1 34, h2 28, h3 21)
- Fontes servidas localmente via `@fontsource` (sem chamada ao Google)

## Forma
- Raio 0 em tudo. Nenhuma sombra. Separação só por filete de 1px.
- Primitivo: grade de compartimentos (`.grid` + `.cell`), usada em categorias, produtos, informações, tamanhos.
- Foto quadrada nas grades (tamanho `square` do Payload), 4:5 inteira na página de produto (`portrait`).

## Espaço
- Margem lateral 80px (desktop), 40px (tablet), 20px (celular)
- Espaço por importância: 208px antes do Estojo e do Sobre, 160px antes de categorias e informações, 112px antes de Novidades

## Movimento
- Hover 160ms, `cubic-bezier(0.2, 0.7, 0.1, 1)`: foto do compartimento com zoom 1.04 e nome sublinhado
- Entrada de seção via `animation-timeline: view()` (CSS puro), só onde há suporte
- Efeito de assinatura (a fazer na página de produto): a foto cresce do compartimento até a página do produto com View Transitions API
- Sem GSAP, sem Lenis, sem carrossel automático, sem scroll-jacking. `prefers-reduced-motion` respeitado.

## Não fazer
Carrossel de banners; texto dentro de imagem; hero centralizado de tela cheia; grade de 3 cards com ícone; faixa de estatísticas; depoimentos sem nome; badge em pílula; `rounded-*`; sombra; fade-up igual em tudo; brilho dourado ou joia cintilando; selo de desconto piscando; corações e laços; Inter, Poppins, Montserrat, Roboto; preto ou branco puros; alternar fundo claro e escuro entre seções; logo cacau no site; travessão nos textos.
