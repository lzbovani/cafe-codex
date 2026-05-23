# Cafe Codex

Site de cafe gourmet com tema dourado e preto, tracking de clique em compra e ranking de interesse.

## Rodar localmente

1. Instale dependencias:
   npm install
2. Inicie o servidor:
   npm start
3. Abra no navegador:
   http://localhost:3000

## Funcionalidades

- Landing page de venda de cafe gourmet.
- Botao `Comprar` salva clique no banco SQLite.
- Botao `O que mais compram` mostra ranking com base nos cliques salvos.

## Banco de dados

- Banco SQLite em `data/clicks.db` (criado automaticamente ao iniciar o servidor).
- Tabela: `purchase_clicks`.
