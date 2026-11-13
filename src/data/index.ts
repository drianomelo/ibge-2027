import blocosJson from "./blocos.json";
import ct01Json from "./ct01.json";
import ct02Json from "./ct02.json";
import ct03Json from "./ct03.json";
import ct04Json from "./ct04.json";
import ct05Json from "./ct05.json";
import ct06Json from "./ct06.json";
import ct07Json from "./ct07.json";
import ct08Json from "./ct08.json";
import { ALTERNATIVA_LETRAS, type Bloco, type BlocoCarregado, type Catalogo, type LetraAlternativa, type Questao } from "../types";

export const IDS_BLOCOS = ["ct01", "ct02", "ct03", "ct04", "ct05", "ct06", "ct07", "ct08"] as const;

const arquivosQuestoes: Record<string, unknown> = {
  ct01: ct01Json,
  ct02: ct02Json,
  ct03: ct03Json,
  ct04: ct04Json,
  ct05: ct05Json,
  ct06: ct06Json,
  ct07: ct07Json,
  ct08: ct08Json,
};

const chavesAlternativas = [...ALTERNATIVA_LETRAS].sort();

function ehRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function textoValido(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

function validarMetadados(raw: unknown): { blocos: Bloco[]; erros: string[] } {
  const erros: string[] = [];
  if (!Array.isArray(raw)) return { blocos: [], erros: ["blocos.json deve conter um array."] };
  if (raw.length !== IDS_BLOCOS.length) erros.push("blocos.json deve conter os oito blocos CT 01 a CT 08.");

  const blocos: Bloco[] = [];
  const ids = new Set<string>();

  raw.forEach((item, index) => {
    const prefixo = `blocos.json, item ${index + 1}`;
    if (!ehRegistro(item)) {
      erros.push(`${prefixo}: o item deve ser um objeto.`);
      return;
    }

    const { id, titulo, capitulos, paginas, questoesPlanejadas } = item;
    if (!IDS_BLOCOS.includes(id as (typeof IDS_BLOCOS)[number])) erros.push(`${prefixo}: id deve ser ct01 a ct08.`);
    if (typeof id === "string" && ids.has(id)) erros.push(`${prefixo}: id duplicado (${id}).`);
    if (typeof id === "string") ids.add(id);
    if (!textoValido(titulo)) erros.push(`${prefixo}: titulo deve ser um texto não vazio.`);
    if (!Array.isArray(capitulos) || capitulos.length === 0 || !capitulos.every((capitulo) => Number.isInteger(capitulo) && capitulo > 0)) {
      erros.push(`${prefixo}: capitulos deve ser um array de números inteiros positivos.`);
    }
    if (!Array.isArray(paginas) || paginas.length !== 2 || !paginas.every((pagina) => Number.isFinite(pagina) && pagina > 0) || paginas[0] > paginas[1]) {
      erros.push(`${prefixo}: paginas deve conter a página inicial e a final.`);
    }
    if (!Number.isInteger(questoesPlanejadas) || Number(questoesPlanejadas) < 0) {
      erros.push(`${prefixo}: questoesPlanejadas deve ser um inteiro não negativo.`);
    }

    if (
      IDS_BLOCOS.includes(id as (typeof IDS_BLOCOS)[number]) && textoValido(titulo) &&
      Array.isArray(capitulos) && capitulos.every((capitulo) => Number.isInteger(capitulo) && capitulo > 0) &&
      Array.isArray(paginas) && paginas.length === 2 && paginas.every((pagina) => Number.isFinite(pagina) && pagina > 0) && paginas[0] <= paginas[1] &&
      Number.isInteger(questoesPlanejadas) && Number(questoesPlanejadas) >= 0
    ) {
      blocos.push({
        id: String(id),
        titulo,
        capitulos,
        paginas: [paginas[0], paginas[1]],
        questoesPlanejadas: Number(questoesPlanejadas),
      });
    }
  });

  const actualIds = new Set(blocos.map((bloco) => bloco.id));
  for (const id of IDS_BLOCOS) if (!actualIds.has(id)) erros.push(`blocos.json: bloco ${id} ausente ou inválido.`);
  return { blocos, erros };
}

function validarQuestao(raw: unknown, blocoId: string, index: number): { questao?: Questao; erros: string[] } {
  const prefixo = `${blocoId}.json, questão ${index + 1}`;
  if (!ehRegistro(raw)) return { erros: [`${prefixo}: a questão deve ser um objeto.`] };
  const erros: string[] = [];
  const { id, bloco, capitulo, topico, paginaPDF, enunciado, alternativas, correta, explicacao, fonte } = raw;

  if (!textoValido(id)) erros.push(`${prefixo}: id deve ser um texto não vazio.`);
  if (bloco !== blocoId) erros.push(`${prefixo}: bloco deve ser "${blocoId}".`);
  if (!Number.isInteger(capitulo) || Number(capitulo) < 1) erros.push(`${prefixo}: capitulo deve ser um inteiro positivo.`);
  if (!textoValido(topico)) erros.push(`${prefixo}: topico deve ser um texto não vazio.`);
  if (!Number.isFinite(paginaPDF) || Number(paginaPDF) < 1) erros.push(`${prefixo}: paginaPDF deve ser um número positivo.`);
  if (!textoValido(enunciado)) erros.push(`${prefixo}: enunciado deve ser um texto não vazio.`);
  if (!ehRegistro(alternativas)) {
    erros.push(`${prefixo}: alternativas deve conter A, B, C, D e E.`);
  } else {
    const actualKeys = Object.keys(alternativas).sort();
    if (JSON.stringify(actualKeys) !== JSON.stringify(chavesAlternativas)) erros.push(`${prefixo}: alternativas deve conter somente as chaves A, B, C, D e E.`);
    for (const letra of ALTERNATIVA_LETRAS) {
      if (!textoValido(alternativas[letra])) erros.push(`${prefixo}: alternativa ${letra} deve ter um texto não vazio.`);
    }
  }
  if (!ALTERNATIVA_LETRAS.includes(correta as LetraAlternativa)) erros.push(`${prefixo}: correta deve ser A, B, C, D ou E.`);
  if (!textoValido(explicacao)) erros.push(`${prefixo}: explicacao deve ser um texto não vazio.`);
  if (!textoValido(fonte)) erros.push(`${prefixo}: fonte deve ser um texto não vazio.`);

  if (erros.length > 0 || !ehRegistro(alternativas)) return { erros };
  return {
    questao: {
      id: String(id),
      bloco: String(bloco),
      capitulo: Number(capitulo),
      topico: String(topico),
      paginaPDF: Number(paginaPDF),
      enunciado: String(enunciado),
      alternativas: {
        A: String(alternativas.A),
        B: String(alternativas.B),
        C: String(alternativas.C),
        D: String(alternativas.D),
        E: String(alternativas.E),
      },
      correta: correta as LetraAlternativa,
      explicacao: String(explicacao),
      fonte: String(fonte),
    },
    erros: [],
  };
}

export function loadCatalogo(rawBlocos: unknown, rawQuestoes: Record<string, unknown>): Catalogo {
  const metadata = validarMetadados(rawBlocos);
  if (metadata.erros.length > 0) return { blocos: [], erros: metadata.erros };

  const idsQuestoes = new Set<string>();
  const blocos: Catalogo["blocos"] = metadata.blocos.map((bloco) => {
    const rawSet = rawQuestoes[bloco.id];
    const erros: string[] = [];
    if (!Array.isArray(rawSet)) {
      return { bloco, questoes: [], erros: [`${bloco.id}.json deve conter um array.`] };
    }

    const questoes: Questao[] = [];
    rawSet.forEach((raw, index) => {
      const result = validarQuestao(raw, bloco.id, index);
      erros.push(...result.erros);
      if (result.questao) {
        if (idsQuestoes.has(result.questao.id)) erros.push(`${bloco.id}.json: id de questão duplicado (${result.questao.id}).`);
        idsQuestoes.add(result.questao.id);
        questoes.push(result.questao);
      }
    });
    return { bloco, questoes: erros.length > 0 ? [] : questoes, erros };
  });

  return { blocos, erros: blocos.flatMap((item) => item.erros) };
}

export const catalogo = loadCatalogo(blocosJson, arquivosQuestoes);

if (import.meta.env.DEV && catalogo.erros.length > 0) {
  console.error("Os dados do Censo na Prática precisam de correção:", catalogo.erros);
}

export function calcularAcertos(questoes: Questao[], respostas: Record<string, LetraAlternativa>): number {
  return questoes.filter((questao) => respostas[questao.id] === questao.correta).length;
}

export function respostaEstaCorreta(questao: Questao, resposta: LetraAlternativa): boolean {
  return questao.correta === resposta;
}

export function buscarBloco(id: string): BlocoCarregado | undefined {
  return catalogo.blocos.find((item) => item.bloco.id === id);
}

export function contarQuestoesDisponiveis(): number {
  return catalogo.blocos.reduce((total, item) => total + (item.erros.length === 0 ? item.questoes.length : 0), 0);
}
