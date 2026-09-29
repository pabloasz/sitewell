/*
 * components/HotelAmenidades.js
 * Sección "Amenidades" del proyecto concepto "Hotel Meridiano": una tarjeta con ícono por amenidad.
 * Misma rejilla que components/Servicios.js, con un ícono en vez de un número.
 */
import Reveal from "@/components/Reveal";
import HotelAmenidadIcono from "@/components/HotelAmenidadIcono";
import { hotelMeridiano } from "@/data/hotelMeridiano";
import { resaltar } from "@/lib/resaltar";

export default function HotelAmenidades() {
  const { kicker, titulo, texto, lista } = hotelMeridiano.amenidades;

  return (
    <section id="amenidades" className="seccion seccion--alt" aria-labelledby="amenidades-titulo">
      <div className="container">
        <Reveal className="seccion__cabecera">
          <p className="kicker">{kicker}</p>
          <h2 id="amenidades-titulo" className="seccion__titulo">
            {resaltar(titulo)}
          </h2>
          <p className="seccion__texto">{texto}</p>
        </Reveal>

        <ul className="servicios__lista">
          {lista.map((amenidad, i) => (
            <li key={amenidad.titulo}>
              <Reveal retraso={i * 70}>
                <article className="tarjeta servicio">
                  <span className="amenidad__icono" aria-hidden="true">
                    <HotelAmenidadIcono tipo={amenidad.icono} />
                  </span>
                  <h3 className="servicio__titulo">{amenidad.titulo}</h3>
                  <p className="servicio__texto">{amenidad.texto}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
