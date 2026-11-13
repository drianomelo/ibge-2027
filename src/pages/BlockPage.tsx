import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { buscarBloco, respostaEstaCorreta } from "../data";
import { ALTERNATIVA_LETRAS, type LetraAlternativa, type Questao } from "../types";
import { ArrowIcon, SiteFrame } from "../components/SiteFrame";

export interface SessaoBloco {
  indice: number;
  respostas: Record<string, LetraAlternativa>;
  finalizada: boolean;
}

interface Props {
  sessoes: Record<string, SessaoBloco>;
  atualizarSessao: (blocoId: string, transform: (sessao: SessaoBloco) => SessaoBloco) => void;
}

export function BlockPage({ sessoes, atualizarSessao }: Props) {
  const { blocoId = "" } = useParams();
  const registro = buscarBloco(blocoId);
  const indiceSessao = sessoes[blocoId]?.indice ?? 0;
  const resultadoVisivel = sessoes[blocoId]?.finalizada ?? false;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [blocoId, indiceSessao, resultadoVisivel]);

  if (!registro) {
    return (
      <SiteFrame>
        <section className="status-page" aria-labelledby="missing-title">
          <span className="status-symbol" aria-hidden="true">?</span>
          <h1 id="missing-title">Bloco não encontrado</h1>
          <p>Confira o endereço ou volte para escolher um dos blocos disponíveis.</p>
          <Link className="button button-primary" to="/">Voltar aos blocos <ArrowIcon /></Link>
        </section>
      </SiteFrame>
    );
  }

  const { bloco, questoes, erros } = registro;
  if (erros.length > 0) {
    return (
      <SiteFrame>
        <section className="status-page" aria-labelledby="data-error-title">
          <span className="status-symbol status-symbol-error" aria-hidden="true">!</span>
          <h1 id="data-error-title">Não foi possível abrir este bloco</h1>
          <p>Confira os dados de <code>src/data/{bloco.id}.json</code> e tente novamente.</p>
          {import.meta.env.DEV && <IssueList issues={erros} />}
          <Link className="button button-secondary" to="/">Voltar aos blocos <ArrowIcon /></Link>
        </section>
      </SiteFrame>
    );
  }

  if (questoes.length === 0) {
    return (
      <SiteFrame>
        <section className="status-page empty-page" aria-labelledby="empty-title">
          <span className="status-symbol" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M8 6.5h12l4 4V25H8zM20 6.5v4h4M12 15h8M12 19h8" />
            </svg>
          </span>
          <p className="status-context">{bloco.id.toUpperCase().replace("CT", "CT ")} · {bloco.titulo}</p>
          <h1 id="empty-title">Questões em preparação</h1>
          <p>Este bloco ainda não tem questões disponíveis. Volte aos blocos para continuar estudando.</p>
          <Link className="button button-primary" to="/">Voltar aos blocos <ArrowIcon /></Link>
        </section>
      </SiteFrame>
    );
  }

  const sessao = sessoes[bloco.id] ?? { indice: 0, respostas: {}, finalizada: false };
  if (sessao.finalizada) {
    return (
      <SiteFrame>
        <ResultPage
          titulo={bloco.titulo}
          questoes={questoes}
          respostas={sessao.respostas}
          refazer={() => atualizarSessao(bloco.id, () => ({ indice: 0, respostas: {}, finalizada: false }))}
        />
      </SiteFrame>
    );
  }

  const questao = questoes[sessao.indice];
  if (!questao) {
    return (
      <SiteFrame>
        <section className="status-page" aria-labelledby="session-error-title">
          <h1 id="session-error-title">Não foi possível continuar a sessão</h1>
          <p>Reinicie o bloco para começar novamente.</p>
          <button
            className="button button-primary"
            type="button"
            onClick={() => atualizarSessao(bloco.id, () => ({ indice: 0, respostas: {}, finalizada: false }))}
          >
            Refazer bloco <ArrowIcon />
          </button>
        </section>
      </SiteFrame>
    );
  }

  const resposta = sessao.respostas[questao.id];
  const acertou = resposta ? respostaEstaCorreta(questao, resposta) : false;
  const percentual = ((sessao.indice + (resposta ? 1 : 0)) / questoes.length) * 100;
  const isUltima = sessao.indice === questoes.length - 1;

  function responder(letra: LetraAlternativa) {
    atualizarSessao(bloco.id, (atual) => {
      if (atual.finalizada || atual.respostas[questao.id]) return atual;
      return { ...atual, respostas: { ...atual.respostas, [questao.id]: letra } };
    });
  }

  function avancar() {
    if (!resposta) return;
    atualizarSessao(bloco.id, (atual) => {
      if (atual.finalizada || !atual.respostas[questao.id]) return atual;
      if (isUltima) return { ...atual, finalizada: true };
      return { ...atual, indice: atual.indice + 1 };
    });
  }

  return (
    <SiteFrame>
      <section className="quiz-page" aria-labelledby="quiz-title">
        <div className="quiz-topline">
          <Link className="back-link" to="/">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 10H4m6 5-6-5 6-5" /></svg>
            Voltar aos blocos
          </Link>
          <span className="quiz-block-label">{bloco.id.toUpperCase().replace("CT", "CT ")}</span>
        </div>

        <div className="quiz-heading">
          <h1 id="quiz-title">{bloco.titulo}</h1>
          <div className="progress-copy">
            <span>Questão {sessao.indice + 1} de {questoes.length}</span>
            <span className="progress-percent">{Math.round(percentual)}%</span>
          </div>
          <div className="progress-track" role="progressbar" aria-label="Progresso do bloco" aria-valuemin={0} aria-valuemax={questoes.length} aria-valuenow={sessao.indice + (resposta ? 1 : 0)}>
            <span style={{ width: `${percentual}%` }} />
          </div>
        </div>

        <article className="question-panel">
          <div className="question-meta">
            <span>{questao.topico}</span>
            <span>Capítulo {questao.capitulo} · p. {questao.paginaPDF}</span>
          </div>
          <h2 className="question-prompt">{questao.enunciado}</h2>
          <fieldset className="answer-fieldset" disabled={Boolean(resposta)}>
            <legend className="visually-hidden">Escolha uma alternativa</legend>
            <div className="answer-list">
              {ALTERNATIVA_LETRAS.map((letra) => {
                const correta = Boolean(resposta) && questao.correta === letra;
                const incorretaEscolhida = Boolean(resposta) && resposta === letra && !acertou;
                return (
                  <button
                    type="button"
                    className={`answer-option${correta ? " answer-correct" : ""}${incorretaEscolhida ? " answer-wrong" : ""}${resposta === letra ? " answer-selected" : ""}`}
                    key={letra}
                    onClick={() => responder(letra)}
                  >
                    <span className="answer-letter">{letra}</span>
                    <span className="answer-text">{questao.alternativas[letra]}</span>
                    {correta && <span className="answer-state">Correta</span>}
                    {incorretaEscolhida && <span className="answer-state">Sua resposta</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {resposta && (
            <section className={`answer-feedback${acertou ? " feedback-correct" : " feedback-wrong"}`} aria-live="polite" aria-labelledby="feedback-title">
              <div className="feedback-heading">
                <span className="feedback-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    {acertou ? <path d="m3 8 3.2 3.1L13 4.5" /> : <path d="m4 4 8 8m0-8-8 8" />}
                  </svg>
                </span>
                <h3 id="feedback-title">{acertou ? "Você acertou!" : "Você errou."}</h3>
              </div>
              <p className="correct-answer">
                Alternativa correta: <strong>{questao.correta}</strong> — {questao.alternativas[questao.correta]}
              </p>
              <p className="explanation">{questao.explicacao}</p>
              <p className="source-reference">Fonte: {questao.fonte}</p>
            </section>
          )}

          {resposta && (
            <button className="button button-primary next-button" type="button" onClick={avancar}>
              {isUltima ? "Ver resultado" : "Próxima questão"} <ArrowIcon />
            </button>
          )}
        </article>
      </section>
    </SiteFrame>
  );
}

function ResultPage({
  titulo,
  questoes,
  respostas,
  refazer,
}: {
  titulo: string;
  questoes: Questao[];
  respostas: Record<string, LetraAlternativa>;
  refazer: () => void;
}) {
  const acertos = questoes.filter((questao) => respostas[questao.id] === questao.correta).length;
  const erros = questoes.length - acertos;
  const percentual = Math.round((acertos / questoes.length) * 100);

  return (
    <section className="result-page" aria-labelledby="result-title">
      <Link className="back-link" to="/">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 10H4m6 5-6-5 6-5" /></svg>
        Voltar aos blocos
      </Link>
      <div className="result-heading">
        <span className="result-seal" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none"><path d="M24 3 42 13v22L24 45 6 35V13L24 3Z" /><path d="m15 24 6 6 13-14" /></svg>
        </span>
        <h1 id="result-title">Bloco concluído</h1>
        <p>{titulo}</p>
      </div>

      <div className="score-board" aria-label="Resumo do resultado">
        <div className="score-main">
          <span className="score-label">Seu aproveitamento</span>
          <strong>{percentual}<span>%</span></strong>
          <span className="score-caption">{acertos} de {questoes.length} questões corretas</span>
        </div>
        <div className="score-detail"><span>Acertos</span><strong>{acertos}</strong></div>
        <div className="score-detail"><span>Erros</span><strong>{erros}</strong></div>
      </div>

      <div className="result-actions">
        <button className="button button-primary" type="button" onClick={refazer}>Refazer bloco <ArrowIcon /></button>
        <Link className="button button-secondary" to="/">Voltar aos blocos</Link>
      </div>
    </section>
  );
}

function IssueList({ issues }: { issues: string[] }) {
  return (
    <details className="issue-details">
      <summary>Ver detalhes de validação</summary>
      <ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>
    </details>
  );
}
