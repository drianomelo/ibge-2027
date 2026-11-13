import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router";
import { HomePage } from "./pages/HomePage";
import { BlockPage, type SessaoBloco } from "./pages/BlockPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  const [sessoes, setSessoes] = useState<Record<string, SessaoBloco>>({});

  function atualizarSessao(blocoId: string, transform: (sessao: SessaoBloco) => SessaoBloco) {
    setSessoes((atuais) => {
      const sessaoAtual = atuais[blocoId] ?? { indice: 0, respostas: {}, finalizada: false };
      const sessaoAtualizada = transform(sessaoAtual);
      if (sessaoAtualizada === sessaoAtual) return atuais;
      return { ...atuais, [blocoId]: sessaoAtualizada };
    });
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/blocos/:blocoId"
          element={<BlockPage sessoes={sessoes} atualizarSessao={atualizarSessao} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}
