import Reveal from "@/components/Reveal";
import { forja, formatearPrecio } from "@/data/forjaGym";

export default function Planes() {
  return (
    <section className="fj-seccion" id="planes" aria-labelledby="fj-planes-titulo">
      <div className="fj-container">
        <Reveal>
          <p className="fj-kicker">Planes</p>
          <h2 id="fj-planes-titulo" className="fj-seccion__titulo">
            Elige tu plan y empieza esta semana.
          </h2>
        </Reveal>

        <ul className="fj-planes">
          {forja.planes.map((plan, i) => (
            <Reveal
              as="li"
              key={plan.nombre}
              retraso={i * 90}
              className={`fj-plan ${plan.destacado ? "fj-plan--destacado" : ""}`}
            >
              {plan.destacado && <span className="fj-plan__badge">Más elegido</span>}
              <h3>{plan.nombre}</h3>
              <p className="fj-plan__precio">
                {formatearPrecio(plan.precio)}
                <span>{plan.periodo}</span>
              </p>
              <ul className="fj-plan__lista">
                {plan.caracteristicas.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <a
                href={`https://wa.me/${forja.contacto.telefono}?text=${encodeURIComponent(
                  `Hola, quiero más información sobre el plan ${plan.nombre} de FORJA.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`fj-boton ${plan.destacado ? "" : "fj-boton--fantasma"}`}
              >
                Elegir {plan.nombre}
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
