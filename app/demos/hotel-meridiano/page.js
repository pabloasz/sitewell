/*
 * app/demos/hotel-meridiano/page.js
 * El sitio del proyecto concepto "Hotel Meridiano" (ver data/hotelMeridiano.js).
 * Todo el contenido va dentro de <div className="hotel">, que repinta los tokens de color
 * compartidos (ver la sección 16 de app/globals.css) para que se vea como un sitio distinto
 * al de Sitewell, aunque reutilice los mismos componentes base (.boton, .tarjeta, .seccion...).
 *
 * Sigue teniendo el encabezado y el pie de Sitewell (los pone app/layout.js): así queda claro
 * que esto vive dentro del portafolio, y el aviso de abajo lo deja todavía más explícito.
 */
import Link from "next/link";
import HotelHero from "@/components/HotelHero";
import HotelHabitaciones from "@/components/HotelHabitaciones";
import HotelAmenidades from "@/components/HotelAmenidades";
import HotelUbicacion from "@/components/HotelUbicacion";
import HotelReservar from "@/components/HotelReservar";
import "./hotel.css";

export const metadata = {
  title: "Hotel Meridiano — proyecto concepto",
  description:
    "Proyecto concepto de Sitewell: cómo se vería, con diseño 3D interactivo, el sitio de un hotel boutique.",
};

export default function PaginaHotelMeridiano() {
  return (
    <div className="hotel">
      <div className="hotel__aviso">
        <div className="container">
          <p className="hotel__aviso-texto">
            <strong>Proyecto concepto de Sitewell.</strong> Hotel Meridiano no es un hotel real ni un cliente.
          </p>
          <Link className="hotel__aviso-enlace" href="/proyectos/hotel-meridiano">
            Ver el proyecto en el portafolio <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <HotelHero />
      <HotelHabitaciones />
      <HotelAmenidades />
      <HotelUbicacion />
      <HotelReservar />
    </div>
  );
}
