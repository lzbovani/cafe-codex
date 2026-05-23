# Cafe Codex

Site de cafe gourmet com tema dourado e preto.

## GitHub Pages (somente estatico)

URL:
`https://lzbovani.github.io/cafe-codex/`

No GitHub Pages, o site funciona e usa fallback local (`localStorage`) caso nao exista backend.

## Render (ranking compartilhado para todos)

No Render, o frontend usa a API (`/api/click` e `/api/ranking`) e todos veem o mesmo ranking.

1. Abra o servico `cafe-codex` no Render.
2. Clique em `Manual Deploy` > `Deploy latest commit`.
3. Aguarde concluir o build/deploy.
4. Acesse a URL do servico.

## Observacao sobre SQLite no Render

- O banco funciona com caminho padrao em `/tmp/cafe-codex/clicks.db`.
- Em free plan, dados podem ser perdidos quando a instancia reinicia.
- Para persistencia real, use disco persistente e defina `DB_PATH` (exemplo: `/var/data/clicks.db`).
