import Reveal from "./Reveal";
import { sitio } from "@/data/sitio";

// Iniciales para el avatar (mientras no haya fotos): "Jerónimo Gaviria" → "JG"
const iniciales = (nombre) =>
  nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

export default function Nosotros() {
  return (
    <section className="seccion" id="nosotros" aria-labelledby="nosotros-titulo">
      <div className="container nosotros">
        <Reveal className="nosotros__texto">
          <p className="kicker">Nosotros</p>
          <h2 id="nosotros-titulo" className="seccion__titulo">
            Dos socios y una idea fija: que las webs dejen de ser planas.
          </h2>
          <p className="seccion__texto">
            La mayoría de los sitios de negocios pequeños se ven iguales. En Sitewell construimos los
            que se sienten distintos, con diseño 3D como sello y con la rapidez y el cuidado de un
            sitio hecho a mano.
          </p>
        </Reveal>

        <ul className="socios">
          {sitio.socios.map((s, i) => (
            <Reveal as="li" key={s.nombre} retraso={i * 100} className="socio">
              <span className="socio__avatar" aria-hidden="true">
                {iniciales(s.nombre)}
              </span>
              <div>
                <h3>{s.nombre}</h3>
                <p>{s.rol}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
