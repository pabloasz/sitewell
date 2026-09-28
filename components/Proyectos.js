import Link from "next/link";
import Reveal from "./Reveal";
import TarjetaProyecto from "./TarjetaProyecto";
import { proyectos } from "@/data/proyectos";

export default function Proyectos() {
  return (
    <section className="seccion seccion--alt" id="proyectos" aria-labelledby="proyectos-titulo">
      <div className="container">
        <Reveal>
          <p className="kicker">Portafolio</p>
          <h2 id="proyectos-titulo" className="seccion__titulo">
            Cada sitio que construimos vive aquí.
          </h2>
          <p className="seccion__texto">
            Esta galería crece con cada proyecto que entregamos.
          </p>
        </Reveal>

        <div className="proyectos">
          {proyectos.map((p, i) => (
            <Reveal key={p.slug} retraso={i * 80}>
              <TarjetaProyecto proyecto={p} />
            </Reveal>
          ))}

          {/* Tarjeta de invitación: siempre al final de la lista */}
          <Reveal retraso={proyectos.length * 80}>
            <Link href="/#contacto" className="tarjeta tarjeta--invitacion">
              <div className="tarjeta__cuerpo">
                <p className="tarjeta__meta">Próximo proyecto</p>
                <h3>Tu negocio podría estar aquí.</h3>
                <p>Cuéntanos qué necesitas y lo convertimos en una web con dimensión.</p>
                <span className="tarjeta__ver">
                  Hablemos <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
