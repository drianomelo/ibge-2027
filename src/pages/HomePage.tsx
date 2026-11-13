import { Link } from "react-router";
import { catalogo } from "../data";
import { ArrowIcon, SiteFrame } from "../components/SiteFrame";

function formatarCapitulos(capitulos: number[]) {
  return capitulos.length === 1 ? `Capítulo ${capitulos[0]}` : `Capítulos ${capitulos.join(", ")}`;
}

export function HomePage() {
  if (catalogo.blocos.length === 0) {
    return (
      <SiteFrame>
        <section className="status-page" aria-labelledby="data-error-title">
          <span className="status-symbol status-symbol-error" aria-hidden="true">!</span>
          <h1 id="data-error-title">Não foi possível carregar os blocos</h1>
          <p>Confira o formato de <code>src/data/blocos.json</code> e tente novamente.</p>
          {import.meta.env.DEV && <IssueList issues={catalogo.erros} />}
        </section>
      </SiteFrame>
    );
  }

  const questoesDisponiveis = catalogo.blocos.reduce(
    (total, item) => total + (item.erros.length === 0 ? item.questoes.length : 0),
    0,
  );
  const blocosDisponiveis = catalogo.blocos.filter((item) => item.erros.length === 0 && item.questoes.length > 0).length;

  return (
    <SiteFrame>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <h1 id="home-title">Aprenda com cada resposta.</h1>
          <p className="hero-description">
            Pratique Conhecimentos Técnicos para o concurso de Recenseador do IBGE 2027.
            Escolha um bloco, responda no seu ritmo e entenda o conteúdo com explicações e referências.
          </p>
          <a className="button button-primary" href="#blocos">
            Escolher um bloco <ArrowIcon />
          </a>
          <p className="availability" aria-live="polite">
            <strong>{questoesDisponiveis}</strong> {questoesDisponiveis === 1 ? "questão disponível" : "questões disponíveis"}
            {" · "}{blocosDisponiveis} {blocosDisponiveis === 1 ? "bloco pronto" : "blocos prontos"}
          </p>
        </div>

        <aside className="method-panel" aria-label="Como funciona a prática">
          <div className="method-heading">
            <span className="method-rule" aria-hidden="true" />
            <h2>Prática com contexto</h2>
          </div>
          <p>O aprendizado continua depois de marcar a alternativa.</p>
          <ul>
            <li><span className="method-key">A</span><span>Feedback na hora</span></li>
            <li><span className="method-key">B</span><span>Explicação comentada</span></li>
            <li><span className="method-key">C</span><span>Página da apostila indicada</span></li>
          </ul>
          <span className="panel-caption">UMA QUESTÃO POR VEZ</span>
        </aside>
      </section>

      <section className="blocks-section" id="blocos" aria-labelledby="blocks-title">
        <div className="section-heading">
          <div>
            <h2 id="blocks-title">Escolha um bloco</h2>
            <p>Avance por assunto, com tempo para pensar em cada resposta.</p>
          </div>
          <span className="section-count">{catalogo.blocos.length} blocos</span>
        </div>

        <div className="block-grid">
          {catalogo.blocos.map(({ bloco, questoes, erros }) => {
            const disponivel = erros.length === 0 && questoes.length > 0;
            const intervalo = bloco.paginas[0] === bloco.paginas[1]
              ? `p. ${bloco.paginas[0]}`
              : `p. ${bloco.paginas[0]}–${bloco.paginas[1]}`;

            return (
              <article className={`block-card${disponivel ? " block-card-ready" : ""}`} key={bloco.id}>
                <div className="block-card-head">
                  <span className="block-number">{bloco.id.toUpperCase().replace("CT", "CT ")}</span>
                  <span className={`block-status${disponivel ? " block-status-ready" : erros.length ? " block-status-error" : ""}`}>
                    {erros.length > 0 ? "Dados inválidos" : disponivel ? `${questoes.length} ${questoes.length === 1 ? "questão" : "questões"}` : "Em preparação"}
                  </span>
                </div>
                <h3>{bloco.titulo}</h3>
                <div className="block-details">
                  <span>{formatarCapitulos(bloco.capitulos)}</span>
                  <span>{intervalo}</span>
                </div>
                {disponivel ? (
                  <Link className="block-action" to={`/blocos/${bloco.id}`}>
                    Começar <ArrowIcon />
                  </Link>
                ) : (
                  <button className="block-action block-action-disabled" type="button" disabled>
                    {erros.length > 0 ? "Revisar dados" : "Em preparação"}
                  </button>
                )}
                {import.meta.env.DEV && erros.length > 0 && <IssueList issues={erros} />}
              </article>
            );
          })}
        </div>
      </section>
    </SiteFrame>
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
