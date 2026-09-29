/*
 * components/HotelHabitacionIlustracion.js
 * Un emblema de línea por tipo de habitación (ver data/hotelMeridiano.js -> habitaciones.lista[].id),
 * para que la tarjeta no quede con el degradado vacío mientras no hay fotos reales.
 * Se pinta encima de .portada, que ya centra su contenido y lo tiñe de blanco translúcido
 * (currentColor), igual que el logo en las tarjetas de proyecto.
 */
const TRAZO = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };

const ILUSTRACIONES = {
  // Vista Mar: una ventana con el horizonte y el sol asomando.
  "vista-mar": (
    <>
      <rect x="10" y="8" width="36" height="36" rx="3" {...TRAZO} />
      <path d="M10 28h36M28 8v36" {...TRAZO} />
      <circle cx="19" cy="19" r="3.4" {...TRAZO} />
      <path d="M13 24c2-2 4-2 6 0s4 2 6 0 4-2 6 0 4 2 6 0" {...TRAZO} />
    </>
  ),
  // Suite Jardín: una hoja sobre una línea de terraza.
  jardin: (
    <>
      <path d="M28 40c-9 0-14-6-14-15 9 0 14 5 14 15Zm0 0c9 0 14-6 14-15-9 0-14 5-14 15Z" {...TRAZO} />
      <path d="M28 40V17M14 46h28" {...TRAZO} />
    </>
  ),
  // Suite Meridiano: dos niveles (la suite más grande, de dos pisos).
  meridiano: (
    <>
      <rect x="12" y="10" width="32" height="15" rx="2" {...TRAZO} />
      <rect x="16" y="29" width="24" height="15" rx="2" {...TRAZO} />
      <path d="M20 17h6M20 36h6" {...TRAZO} />
    </>
  ),
};

export default function HotelHabitacionIlustracion({ id }) {
  return (
    <svg width="52" height="52" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
      {ILUSTRACIONES[id] ?? <circle cx="28" cy="28" r="16" {...TRAZO} />}
    </svg>
  );
}
