import Marca from "./Marca";
import { sitio } from "@/data/sitio";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__interior">
        <span className="logo">
          <Marca size={22} />
          <span>{sitio.nombre}</span>
        </span>
        <p>
          © {new Date().getFullYear()} {sitio.nombre} · {sitio.socios.map((s) => s.nombre).join(" y ")}
        </p>
      </div>
    </footer>
  );
}
