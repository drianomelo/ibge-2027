# PROMPT PARA CODEX — SITE DE QUESTÕES IBGE 2027

Você é um desenvolvedor full-stack sênior com experiência em React, UX e aplicações educacionais. Quero que crie, NESTA PASTA, um site de questões de estudo para o concurso de Recenseador do IBGE 2027, matéria Conhecimentos Técnicos, usando as questões autorais que vou fornecer em arquivos JSON. **Implemente o projeto funcionando de ponta a ponta, não apenas um protótipo visual.**

## Objetivo do produto

O aluno acessa a página inicial, escolhe um dos oito blocos, vê uma questão de múltipla escolha com cinco alternativas (A a E), marca uma resposta e recebe imediatamente um feedback visual de ACERTO ou ERRO. A alternativa correta fica destacada, é exibida a explicação com a página e a fonte da apostila oficial do IBGE, e aparece um botão **Próxima questão**. Na última questão, aparece a tela de resultado com total de acertos, erros, percentual, botão **Refazer bloco** e **Voltar aos blocos**.

Este produto é SIMPLES: **não precisa de login, contas, banco de dados, backend, APIs, localStorage, cookies, histórico persistente, ranking, painel administrativo nem integração com o TEC.** Todas as questões ficam em arquivos JSON estáticos do projeto; o estado da sessão pode ser mantido apenas em memória no React.

## Stack e execução

- React + TypeScript + Vite.
- Tailwind CSS (configure a versão estável compatível com o projeto).
- React Router para as páginas dos blocos, ou outra solução estática confiável com URL compartilhável por bloco.
- Ícones: lucide-react, se necessários.
- Preparar para GitHub + Vercel no plano gratuito: build estático, sem funções serverless. Caso utilize rotas SPA com History API, adicionar configuração de rewrite para `index.html` (`vercel.json`) e testar navegação direta para URLs internas.
- Comandos usuais: `npm install`, `npm run dev`, `npm run build`.
- Sem dependências desnecessárias e sem chamadas de rede para carregar perguntas.

## Design

Interface original, caprichada, responsiva e mobile-first, em português brasileiro, com cara de plataforma séria para concursos. Fundo claro, cartões com bordas sutis, tipografia legível, cores sóbrias (por exemplo azul-marinho/ciano) e estados de acerto/erro claramente diferenciados. Boa hierarquia visual e excelente usabilidade em celular e computador. Não copiar layout, marcas ou logos do TEC, do IBGE ou da Cesgranrio.

Nome de trabalho do site: **Censo na Prática — IBGE 2027**. Rodapé/aviso discreto: **“Material de estudo com questões autorais, não oficial e sem vínculo com IBGE ou Cesgranrio.”**

## Páginas e experiência

1. `/` — Página inicial:
   - Título curto e uma descrição.
   - Oito cartões, um por bloco, na ordem CT 01 a CT 08.
   - Cada cartão mostra título, capítulos/páginas e a quantidade REAL de questões carregadas naquele bloco.
   - Botão **Começar** para blocos com questões; **Em preparação** desabilitado nos demais.
   - Quantidade global de questões disponíveis calculada dinamicamente, não colocar “155 disponíveis” antes de existirem.
2. `/blocos/ct01` a `/blocos/ct08` — Área de resolução:
   - Título do bloco, contador `Questão X de Y` e barra de progresso.
   - Enunciado completo e cinco alternativas A, B, C, D e E, em botões/cartões acessíveis.
   - Ao selecionar uma alternativa, travar a resposta (sem permitir troca), marcar correta e, se diferente, a escolhida incorreta.
   - Exibir imediatamente `Você acertou!` ou `Você errou.`, alternativa correta, explicação completa e referência à página do PDF.
   - Exibir **Próxima questão** somente depois da resposta; na última, usar **Ver resultado**.
   - Não exibir explicação nem resposta correta antes da escolha.
   - Permitir voltar à home. Manter progresso apenas enquanto a sessão estiver aberta (sem persistência).
3. Resultado do bloco:
   - Quantidade de acertos, erros, percentual arredondado, resumo da sessão e botões de refazer e retornar.
   - Não há necessidade de gravar nada após sair da página.
4. Estados de erro/vazio:
   - Se um bloco não possuir questões, mostrar mensagem amigável `Questões em preparação` e botão de retorno.
   - Se faltar propriedade obrigatória ou houver gabarito inválido em JSON, não quebrar a tela: mostrar erro compreensível no desenvolvimento, com log de validação.

## Arquitetura de dados — OBRIGATÓRIA

Nesta pasta disponibilizarei `blocos.json` e `ct01.json`. Trate-os como a fonte de verdade e use EXATAMENTE o formato de cada objeto; não reescreva as questões nem altere respostas ou explicações. Copie-os para `src/data/`.

`blocos.json` é um array contendo oito objetos:
- `id`: `ct01` até `ct08`;
- `titulo`: nome do bloco;
- `capitulos`: array numérico dos capítulos;
- `paginas`: array de dois números `[inicial, final]`;
- `questoesPlanejadas`: meta de elaboração (não número de questões já disponíveis).

Cada arquivo `src/data/ct01.json`, ..., `src/data/ct08.json` será um array de objetos de questões com:
- `id`: string única, ex.: `CT01-Q01`;
- `bloco`: string, ex.: `ct01`;
- `capitulo`: número;
- `topico`: string;
- `paginaPDF`: número;
- `enunciado`: string;
- `alternativas`: objeto com chaves `A`, `B`, `C`, `D`, `E` e textos string;
- `correta`: uma das letras `A`, `B`, `C`, `D`, `E`;
- `explicacao`: string com a justificativa;
- `fonte`: string descritiva da apostila e página.

Para os blocos ainda não alimentados, CRIE `ct02.json` até `ct08.json` com `[]` — **não invente questões ou conteúdo**. Quando eu substituir esses arquivos por novas questões, o site deve mostrar automaticamente os blocos como disponíveis, sem precisar modificar componentes.

Use tipos TypeScript adequados (`Questao`, `Bloco`), validação básica dos dados e um módulo único para carregar/organizar os oito JSONs. As respostas devem ser calculadas apenas a partir dos dados importados.

## Qualidade e acessibilidade

- Sem erros TypeScript, sem warnings de renderização e sem links quebrados internos.
- Navegação por teclado e estados de foco visíveis; contraste legível.
- Botões com estados disabled corretos; não permitir clique duplo que contabilize a resposta duas vezes.
- Enunciados e alternativas podem ser longos; layout não deve quebrar em telas pequenas.
- Atualizar o placar e o progresso corretamente; reiniciar as respostas ao clicar “Refazer bloco”.
- Adicionar pelo menos testes simples para correção de respostas, contagem de acertos e validação do JSON (pode usar Vitest).
- Criar README.md em português com instruções de desenvolvimento, como incluir `ct02.json` etc., como rodar testes/build e como publicar no Vercel conectado ao GitHub.
- Antes de concluir, executar build e testes e corrigir os problemas identificados.

## Entregáveis

1. Código completo do site nesta pasta, funcionando localmente.
2. Importação correta das **20 questões reais existentes em `ct01.json`**.
3. Sete blocos restantes criados, mas vazios até receber seus JSONs.
4. README em português e configuração pronta para deploy gratuito na Vercel.
5. Ao final, me diga quais arquivos criou e os comandos exatos para abrir o site localmente.

**Importante:** não publique nem envie código ao GitHub/Vercel automaticamente; apenas deixe tudo pronto para eu autorizar depois. Se os JSONs ainda não estiverem nesta pasta, crie o projeto e documente onde devo colocá-los, mas não substitua as questões por exemplos inventados.
