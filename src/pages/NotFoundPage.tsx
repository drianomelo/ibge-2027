import { Link } from "react-router";
import { ArrowIcon, SiteFrame } from "../components/SiteFrame";

export function NotFoundPage() {
  return (
    <SiteFrame>
      <section className="status-page" aria-labelledby="not-found-title">
        <span className="status-symbol" aria-hidden="true">404</span>
        <h1 id="not-found-title">Página não encontrada</h1>
        <p>O endereço não corresponde a uma página deste material de estudo.</p>
        <Link className="button button-primary" to="/">Voltar aos blocos <ArrowIcon /></Link>
      </section>
    </SiteFrame>
  );
}
