# Madu · loja virtual

Site da Madu (moda, semijoias, calçados e body splash, Paulo Afonso, BA), com painel para a família cadastrar produtos.

## Rodar no seu computador (primeira vez)

1. **Node 20 ou mais novo.** Confira com `node -v`.
2. **Banco de dados.** Crie um banco grátis em https://neon.tech (Postgres). Copie a *connection string*.
3. **Arquivo de ambiente.** Copie `.env.example` para `.env` e preencha:
   - `DATABASE_URL` com a connection string do Neon
   - `PAYLOAD_SECRET` com uma frase longa qualquer
4. **Instalar e subir:**
   ```bash
   npm install
   npm run seed        # cria as categorias
   npm run seed:demo   # opcional: produtos de exemplo
   npm run dev
   ```
5. Abra http://localhost:3000/admin, crie o primeiro usuário (vira o acesso da equipe) e depois veja o site em http://localhost:3000.

## O que já está pronto
- Painel em português: Produtos (com tamanhos, cores e estoque por variação), Categorias e subcategorias, Fotos, Pedidos, Equipe e Dados da loja
- Página inicial completa (bandeja, categorias, novidades, estojo da semana, sobre, entrega/pagamento/ajuda), no computador e no celular

## Próximas etapas
1. Lista de categoria, página de produto, sacola e finalizar compra
2. Meio de pagamento (a definir) e cálculo de frete
3. Publicação na Vercel com o domínio da loja

## Pendências da família
WhatsApp, Instagram, desconto no Pix, parcelas, frete grátis, endereço e horário de retirada. Tudo isso é preenchido no painel em **Dados da loja**, sem mexer no código.
