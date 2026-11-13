export const ALTERNATIVA_LETRAS = ["A", "B", "C", "D", "E"] as const;

export type LetraAlternativa = (typeof ALTERNATIVA_LETRAS)[number];

export interface Questao {
  id: string;
  bloco: string;
  capitulo: number;
  topico: string;
  paginaPDF: number;
  enunciado: string;
  alternativas: Record<LetraAlternativa, string>;
  correta: LetraAlternativa;
  explicacao: string;
  fonte: string;
}

export interface Bloco {
  id: string;
  titulo: string;
  capitulos: number[];
  paginas: [number, number];
  questoesPlanejadas: number;
}

export interface BlocoCarregado {
  bloco: Bloco;
  questoes: Questao[];
  erros: string[];
}

export interface Catalogo {
  blocos: BlocoCarregado[];
  erros: string[];
}
