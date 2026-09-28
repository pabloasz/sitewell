import Reveal from "@/components/Reveal";
import { forja } from "@/data/forjaGym";

export default function Numeros() {
  return (
    <section className="fj-numeros" aria-label="FORJA en números">
      <div className="fj-container fj-numeros__fila">
        {forja.numeros.map((n, i) => (
          <Reveal as="div" key={n.etiqueta} retraso={i * 80} className="fj-numero">
            <span className="fj-numero__valor">{n.valor}</span>
            <span className="fj-numero__etiqueta">{n.etiqueta}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
