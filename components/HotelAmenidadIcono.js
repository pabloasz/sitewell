/*
 * components/HotelAmenidadIcono.js
 * Un ícono de línea por tipo de amenidad (ver data/hotelMeridiano.js -> amenidades.lista[].icono).
 * Mismo trazo que el logo de Sitewell (stroke con currentColor) para que se vea consistente.
 */
const TRAZO = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

const ICONOS = {
  piscina: (
    <>
      <path d="M4 9c1.5 0 1.5 1.5 3 1.5S8.5 9 10 9s1.5 1.5 3 1.5S14.5 9 16 9s1.5 1.5 3 1.5S20.5 9 22 9" {...TRAZO} />
      <path d="M4 15c1.5 0 1.5 1.5 3 1.5s1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5 1.5 1.5 3 1.5 1.5-1.5 3-1.5" {...TRAZO} />
    </>
  ),
  spa: <path d="M12 3c3 3 5 6 5 9a5 5 0 0 1-10 0c0-3 2-6 5-9Zm0 14v4" {...TRAZO} />,
  restaurante: (
    <>
      <path d="M7 3v7a2 2 0 0 0 2 2v9M7 3v6M9 3v6M7 6H5.5" {...TRAZO} />
      <path d="M17 3c-1.7 0-3 2-3 5s1.3 5 3 5v9" {...TRAZO} />
    </>
  ),
  playa: (
    <>
      <path d="M12 12c4-4 8-3 9 1-4-1-6 0-9 3-3-3-5-4-9-3 1-4 5-5 9-1Z" {...TRAZO} />
      <path d="M12 12v9M6 21h12" {...TRAZO} />
    </>
  ),
  wifi: (
    <>
      <path d="M4 9c4.5-4.5 11.5-4.5 16 0M7 12.5c2.8-2.8 6.2-2.8 9 0M10.3 16c1-1 2.4-1 3.4 0" {...TRAZO} />
      <circle cx="12" cy="19" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  traslado: (
    <>
      <path d="M3 16V9l3-1 2-4h5l2 4 3 1v7" {...TRAZO} />
      <circle cx="7.5" cy="16" r="1.6" {...TRAZO} />
      <circle cx="16.5" cy="16" r="1.6" {...TRAZO} />
      <path d="M3 13h18" {...TRAZO} />
    </>
  ),
};

export default function HotelAmenidadIcono({ tipo }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICONOS[tipo] ?? <circle cx="12" cy="12" r="8" {...TRAZO} />}
    </svg>
  );
}
