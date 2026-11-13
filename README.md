# Censo na Prática — IBGE 2027

Site estático para praticar Conhecimentos Técnicos para o concurso de Recenseador do IBGE 2027. As questões são carregadas de arquivos JSON locais; não há login, backend ou persistência de respostas.

## Requisitos

- Node.js 20.19+ (ou 22.12+). Node.js 24 também é compatível.
- npm.

## Rodar localmente

No terminal, a partir desta pasta:

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente <http://localhost:5173>.

## Testes e build

```bash
npm run test
npm run build
npm run preview
```

O build estático é gerado em `dist/`. `npm run preview` serve uma conferência local desse build.

## Incluir questões em um bloco

O site lê `src/data/blocos.json` e `src/data/ct01.json` até `src/data/ct08.json`. Os arquivos da raiz `blocos.json` e `ct01.json` foram preservados como recebidos; faça as próximas alterações nos arquivos de `src/data/`.

Os blocos CT 02 a CT 08 começam com `[]`. Para disponibilizar um deles:

1. Abra o arquivo correspondente, por exemplo `src/data/ct02.json`.
2. Substitua `[]` por um array de questões no formato abaixo, mantendo o texto original e uma chave `id` única.
3. Salve e recarregue a página. A contagem e o botão **Começar** são atualizados automaticamente.

```json
[
  {
    "id": "CT02-Q01",
    "bloco": "ct02",
    "capitulo": 4,
    "topico": "Nome do tópico",
    "paginaPDF": 11,
    "enunciado": "Enunciado completo da questão.",
    "alternativas": {
      "A": "Alternativa A",
      "B": "Alternativa B",
      "C": "Alternativa C",
      "D": "Alternativa D",
      "E": "Alternativa E"
    },
    "correta": "A",
    "explicacao": "Justificativa completa da resposta.",
    "fonte": "IBGE, título da apostila, p. 11"
  }
]
```

Cada questão precisa de todos os campos mostrados, cinco alternativas não vazias e um gabarito `A`, `B`, `C`, `D` ou `E`. A validação informa os campos inválidos no console e na tela de desenvolvimento para o bloco afetado. O título, capítulos e páginas dos blocos vêm de `src/data/blocos.json`; `questoesPlanejadas` é uma meta e não aparece como quantidade disponível.

## Publicar na Vercel com GitHub

1. Crie um repositório no GitHub e envie o projeto quando quiser publicá-lo.
2. Na Vercel, importe esse repositório e mantenha a pasta raiz do projeto como diretório de trabalho.
3. Use `npm run build` como comando de build e `dist` como pasta de saída. A Vercel normalmente identifica Vite automaticamente.
4. Publique o projeto pela Vercel. `vercel.json` inclui a reescrita para `index.html`, necessária para abrir diretamente endereços como `/blocos/ct01`.

Nenhuma publicação é feita automaticamente por este projeto.

## Aviso

Material de estudo com questões autorais, não oficial e sem vínculo com IBGE ou Cesgranrio.
