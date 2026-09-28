import Reveal from "@/components/Reveal";
import { forja } from "@/data/forjaGym";

export default function ContactoForja() {
  return (
    <section className="fj-seccion fj-seccion--alt" id="contacto" aria-labelledby="fj-contacto-titulo">
      <div className="fj-container">
        <Reveal className="fj-contacto">
          <div className="fj-contacto__texto">
            <p className="fj-kicker">Visítanos</p>
            <h2 id="fj-contacto-titulo" className="fj-seccion__titulo">
              Tu primera clase es gratis.
            </h2>
            <p className="fj-seccion__texto">
              Escríbenos y te agendamos una sesión de prueba, sin compromiso.
            </p>
            <div className="fj-hero__acciones">
              <a
                href={`https://wa.me/${forja.contacto.telefono}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fj-boton"
              >
                WhatsApp {forja.contacto.telefonoVisible}
              </a>
              <a href={`mailto:${forja.contacto.email}`} className="fj-boton fj-boton--fantasma">
                {forja.contacto.email}
              </a>
            </div>
          </div>

          <div className="fj-contacto__datos">
            <dl>
              <dt>Dirección</dt>
              <dd>
                {forja.ubicacion.direccion}
                <br />
                {forja.ubicacion.ciudad}
              </dd>
              <dt>Horario</dt>
              <dd>
                <ul className="fj-horario">
                  {forja.horario.map((h) => (
                    <li key={h.dias}>
                      <span>{h.dias}</span>
                      <span>{h.horas}</span>
                    </li>
                  ))}
                </ul>
              </dd>
              <dt>Instagram</dt>
              <dd>{forja.contacto.instagram}</dd>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
