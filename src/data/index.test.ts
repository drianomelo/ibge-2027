import { describe, expect, it } from "vitest";
import blocos from "./blocos.json";
import ct01 from "./ct01.json";
import {
  calcularAcertos,
  catalogo,
  loadCatalogo,
  respostaEstaCorreta,
} from "./index";
import { ALTERNATIVA_LETRAS } from "../types";

describe("dados do catálogo", () => {
  it("carrega os 20 itens fornecidos apenas no CT 01", () => {
    expect(catalogo.blocos).toHaveLength(8);
    expect(catalogo.blocos.find((item) => item.bloco.id === "ct01")?.questoes).toHaveLength(20);
    expect(catalogo.blocos.filter((item) => item.bloco.id !== "ct01").every((item) => item.questoes.length === 0)).toBe(true);
  });

  it("confere uma resposta e conta acertos sem duplicar questões", () => {
    const questoes = catalogo.blocos[0].questoes.slice(0, 2);
    const primeira = questoes[0];
    const segunda = questoes[1];
    const respostaErrada = ALTERNATIVA_LETRAS.find((letra) => letra !== segunda.correta)!;
    const respostas = { [primeira.id]: primeira.correta, [segunda.id]: respostaErrada };

    expect(respostaEstaCorreta(primeira, primeira.correta)).toBe(true);
    expect(respostaEstaCorreta(segunda, respostaErrada)).toBe(false);
    expect(calcularAcertos(questoes, respostas)).toBe(1);
  });

  it("recusa gabarito inválido e propriedade obrigatória ausente", () => {
    const questaoOriginal = ct01[0];
    const questaoInvalida = { ...questaoOriginal, correta: "Z", explicacao: "" };
    const conjuntos: Record<string, unknown> = {
      ct01: [questaoInvalida],
      ct02: [], ct03: [], ct04: [], ct05: [], ct06: [], ct07: [], ct08: [],
    };

    const resultado = loadCatalogo(blocos, conjuntos);
    const primeiroBloco = resultado.blocos.find((item) => item.bloco.id === "ct01");

    expect(primeiroBloco?.questoes).toHaveLength(0);
    expect(primeiroBloco?.erros.join(" ")).toContain("correta deve ser A, B, C, D ou E");
    expect(primeiroBloco?.erros.join(" ")).toContain("explicacao deve ser um texto não vazio");
  });
});
