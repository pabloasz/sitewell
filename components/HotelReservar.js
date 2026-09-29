/*
 * components/HotelReservar.js
 * Sección "Reservar" del proyecto concepto "Hotel Meridiano": el cierre de la página.
 * El botón "Reservar" está deshabilitado a propósito (no hay sistema de reservas real) y
 * el panel deja claro que esto es un proyecto concepto, no un hotel real.
 * El segundo botón sí funciona: lleva al contacto real de Sitewell.
 */
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { hotelMeridiano } from "@/data/hotelMeridiano";
import { resaltar } from "@/lib/resaltar";

export default function HotelReservar() {
  const { kicker, titulo, texto, notaDemo, botonReservar, botonSitewell } = hotelMeridiano.reservar;

  return (
    <section id="reservar" className="seccion" aria-labelledby="reservar-titulo">
      <div className="container">
        <Reveal className="contacto__panel">
          <p className="kicker">{kicker}</p>
          <h2 id="reservar-titulo" className="contacto__titulo">
            {resaltar(titulo)}
          </h2>
          <p className="seccion__texto">{texto}</p>

          <div className="hero__acciones">
            <button type="button" className="boton" disabled aria-disabled="true">
              {botonReservar.texto}
              <span className="solo-lectores"> (botón de ejemplo, no hace ninguna reserva)</span>
            </button>
            <Link className="boton boton--fantasma" href={botonSitewell.href}>
              {botonSitewell.texto}
            </Link>
          </div>

          <p className="contacto__aviso">{notaDemo}</p>
        </Reveal>
      </div>
    </section>
  );
}
