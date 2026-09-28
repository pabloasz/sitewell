import Reveal from "./Reveal";
import { sitio } from "@/data/sitio";

export default function Contacto() {
  const { email, whatsapp } = sitio.contacto;
  const hayCanal = Boolean(email || whatsapp.length);

  return (
    <section className="seccion seccion--contacto" id="contacto" aria-labelledby="contacto-titulo">
      <div className="container">
        <Reveal className="contacto">
          <p className="kicker">Contacto</p>
          <h2 id="contacto-titulo" className="contacto__titulo">
            ¿Hablamos de tu <em>próxima web</em>?
          </h2>
          <p className="seccion__texto">
            Cuéntanos sobre tu negocio y qué te gustaría lograr. Te respondemos con una propuesta clara.
          </p>

          <div className="hero__acciones">
            {email && (
              <a className="boton" href={`mailto:${email}`}>
                {email}
              </a>
            )}
            {whatsapp.map((w) => (
              <a
                key={w.numero}
                className="boton boton--fantasma"
                href={`https://wa.me/${w.numero}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {w.visible}
              </a>
            ))}
          </div>

          {/* Solo se ve si no hay ningún canal configurado en data/sitio.js */}
          {!hayCanal && (
            <p className="contacto__pendiente">
              Estamos terminando de configurar nuestros canales de contacto.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
