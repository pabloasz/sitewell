/*
 * components/HotelHabitaciones.js
 * Sección "Habitaciones" del proyecto concepto "Hotel Meridiano": una tarjeta por habitación.
 * Reutiliza las clases .tarjeta y .portada (las mismas de las tarjetas de proyecto) para no
 * repetir estilos; el degradado de cada .portada hace de foto mientras no hay capturas reales.
 */
import Reveal from "@/components/Reveal";
import HotelHabitacionIlustracion from "@/components/HotelHabitacionIlustracion";
import { hotelMeridiano } from "@/data/hotelMeridiano";
import { resaltar } from "@/lib/resaltar";

export default function HotelHabitaciones() {
  const { kicker, titulo, texto, lista } = hotelMeridiano.habitaciones;

  return (
    <section id="habitaciones" className="seccion" aria-labelledby="habitaciones-titulo">
      <div className="container">
        <Reveal className="seccion__cabecera">
          <p className="kicker">{kicker}</p>
          <h2 id="habitaciones-titulo" className="seccion__titulo">
            {resaltar(titulo)}
          </h2>
          <p className="seccion__texto">{texto}</p>
        </Reveal>

        <div className="habitaciones__lista">
          {lista.map((habitacion, i) => (
            <Reveal key={habitacion.id} retraso={i * 80}>
              <article className="tarjeta habitacion">
                <div
                  className="portada"
                  style={{ "--desde": habitacion.portada.desde, "--hasta": habitacion.portada.hasta }}
                  aria-hidden="true"
                >
                  <HotelHabitacionIlustracion id={habitacion.id} />
                </div>
                <div className="habitacion__cuerpo">
                  <h3 className="habitacion__nombre">{habitacion.nombre}</h3>
                  <p className="habitacion__texto">{habitacion.texto}</p>
                  <ul className="ficha__etiquetas">
                    {habitacion.etiquetas.map((etiqueta) => (
                      <li key={etiqueta}>{etiqueta}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
