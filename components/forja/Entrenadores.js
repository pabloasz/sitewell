import Reveal from "@/components/Reveal";
import { forja } from "@/data/forjaGym";

// Iniciales para el avatar (mientras no haya fotos): "Camila Restrepo" → "CR"
const iniciales = (nombre) =>
  nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

export default function Entrenadores() {
  return (
    <section className="fj-seccion fj-seccion--alt" id="entrenadores" aria-labelledby="fj-entrenadores-titulo">
      <div className="fj-container">
        <Reveal>
          <p className="fj-kicker">Entrenadores</p>
          <h2 id="fj-entrenadores-titulo" className="fj-seccion__titulo">
            El equipo que te acompaña en cada sesión.
          </h2>
        </Reveal>

        <ul className="fj-entrenadores">
          {forja.entrenadores.map((e, i) => (
            <Reveal as="li" key={e.nombre} retraso={i * 90} className="fj-entrenador">
              <span className="fj-entrenador__avatar" aria-hidden="true">
                {iniciales(e.nombre)}
              </span>
              <div>
                <h3>{e.nombre}</h3>
                <p className="fj-entrenador__especialidad">{e.especialidad}</p>
                <p>{e.bio}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
