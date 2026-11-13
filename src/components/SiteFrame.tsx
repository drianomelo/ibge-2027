import type { ReactNode } from "react";
import { Link } from "react-router";

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="site-frame">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Censo na Prática — página inicial">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 3.5 26.5 9v14L16 28.5 5.5 23V9L16 3.5Z" />
              <path d="M16 8v16M9 12l14 8M23 12 9 20" />
              <circle cx="16" cy="16" r="2.25" />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>Censo na Prática</strong>
            <span>IBGE · 2027</span>
          </span>
        </Link>
        <Link className="header-link" to="/" aria-label="Voltar para os blocos de estudo">
          Blocos de estudo
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 10h11M10 5l5 5-5 5" />
          </svg>
        </Link>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <span>Material de estudo com questões autorais, não oficial e sem vínculo com IBGE ou Cesgranrio.</span>
        <span className="footer-year">IBGE · 2027</span>
      </footer>
    </div>
  );
}

export function ArrowIcon() {
  return (
    <svg className="arrow-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3.5 10h12M10 4.5l5.5 5.5-5.5 5.5" />
    </svg>
  );
}
