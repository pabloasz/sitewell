import Reveal from "@/components/Reveal";
import { forja } from "@/data/forjaGym";

export default function Programas() {
  return (
    <section className="fj-seccion" id="programas" aria-labelledby="fj-programas-titulo">
      <div className="fj-container">
        <Reveal>
          <p className="fj-kicker">Programas</p>
          <h2 id="fj-programas-titulo" className="fj-seccion__titulo">
            Un plan de entrenamiento para cada objetivo.
          </h2>
        </Reveal>

        <ul className="fj-programas">
          {forja.programas.map((p, i) => (
            <Reveal as="li" key={p.titulo} retraso={i * 70} className="fj-programa">
              <span className="fj-programa__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
