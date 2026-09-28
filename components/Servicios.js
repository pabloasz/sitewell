import Reveal from "./Reveal";
import { sitio } from "@/data/sitio";

export default function Servicios() {
  return (
    <section className="seccion" id="servicios" aria-labelledby="servicios-titulo">
      <div className="container">
        <Reveal>
          <p className="kicker">Qué hacemos</p>
          <h2 id="servicios-titulo" className="seccion__titulo">
            Páginas web que no se parecen a una plantilla.
          </h2>
        </Reveal>

        <ul className="servicios">
          {sitio.servicios.map((s, i) => (
            <Reveal as="li" key={s.titulo} retraso={i * 80} className="servicio">
              <span className="servicio__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
