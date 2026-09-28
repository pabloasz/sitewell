import MarcaForja from "./MarcaForja";
import { forja } from "@/data/forjaGym";

export default function FooterForja() {
  return (
    <footer className="fj-footer">
      <div className="fj-container fj-footer__interior">
        <span className="fj-logo">
          <MarcaForja size={22} />
          <span>{forja.nombre}</span>
        </span>
        <p>
          © {new Date().getFullYear()} {forja.nombreCompleto} · {forja.ubicacion.ciudad}
        </p>
        <a href="/" className="fj-footer__credito">
          Sitio de demostración diseñado por Sitewell ↗
        </a>
      </div>
    </footer>
  );
}
