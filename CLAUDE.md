@AGENTS.md
@DESIGN.md

# Madu · loja virtual

Next.js 16 (App Router) + Payload 3 (painel em /admin) + Postgres. Textos em português do Brasil, sem travessão.

## Comandos
- `npm run dev` · servidor local em http://localhost:3000 (painel em /admin)
- `npm run seed` · cria as categorias
- `npm run seed:demo` · produtos de exemplo com "[exemplo]" no nome (apagar antes de lançar)
- `npm run generate:types` · depois de mudar coleções em `src/collections`
- `npm run generate:importmap` · depois de adicionar componentes ao painel
- `npm run build` · build de produção

## Estrutura
- `src/collections` · Produtos, Categorias, Fotos (media), Pedidos, Equipe
- `src/globals/StoreSettings.ts` · Dados da loja (WhatsApp, Instagram, Pix, parcelas, frete, fotos da bandeja)
- `src/app/(frontend)` · site; `src/app/(payload)` · painel (não editar à mão)
- `src/lib/data.ts` · consultas ao Payload usadas pelas páginas
- `src/components` · cabeçalho, rodapé, foto, compartimento de produto

## Regras
- Todo visual segue DESIGN.md. Classes em `styles.css`, sem Tailwind.
- Condições de pagamento e frete vêm de `store-settings`; nunca escrever números fixos no código.
- Meio de pagamento ainda não escolhido: o checkout vai usar uma interface em `src/lib/payments` com um provedor de teste até a escolha.
