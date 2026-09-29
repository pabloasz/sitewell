/*
 * components/HotelUbicacion.js
 * Sección "Ubicación" del proyecto concepto "Hotel Meridiano": un texto corto y los puntos
 * más destacados de dónde queda. Sin mapa ni dirección real: la ubicación es ficticia.
 */
import Reveal from "@/components/Reveal";
import { hotelMeridiano } from "@/data/hotelMeridiano";
import { resaltar } from "@/lib/resaltar";

export default function HotelUbicacion() {
  const { kicker, titulo, texto, destacados } = hotelMeridiano.ubicacion;

  return (
    <section id="ubicacion" className="seccion" aria-labelledby="ubicacion-titulo">
      <div className="container ubicacion__rejilla">
        <Reveal className="seccion__cabecera ubicacion__cabecera">
          <p className="kicker">{kicker}</p>
          <h2 id="ubicacion-titulo" className="seccion__titulo">
            {resaltar(titulo)}
          </h2>
          <p className="seccion__texto">{texto}</p>
        </Reveal>

        <Reveal retraso={100}>
          <ul className="tarjeta ubicacion__lista">
            {destacados.map((destacado) => (
              <li key={destacado}>
                <span className="ubicacion__punto" aria-hidden="true" />
                {destacado}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
