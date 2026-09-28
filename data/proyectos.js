// ─────────────────────────────────────────────────────────────────────────
//  PROYECTOS DEL PORTAFOLIO
//
//  Para agregar un proyecto nuevo: copia uno de los bloques de abajo,
//  pégalo al FINAL de la lista y cambia los datos. La tarjeta en la
//  portada y su página propia (/proyectos/<slug>) se crean solas.
//
//  Campos:
//    slug          Identificador para la URL. Minúsculas, sin espacios ni
//                  tildes, con guiones. Debe ser único. Ej: "cafe-la-ceiba"
//    titulo        Nombre del proyecto.
//    categoria     Tipo de sitio. Ej: "Restaurante · Sitio con menú 3D"
//    anio          Año de lanzamiento.
//    estado        "publicado" o "en-desarrollo".
//    resumen       Una frase para la tarjeta.
//    descripcion   Lista de párrafos para la página del proyecto.
//    tecnologias   Lista de tecnologías usadas.
//    enlace        URL del sitio en vivo, o null si aún no existe.
//    portada       Dos colores (desde → hasta) para el degradado de la
//                  tarjeta, hasta que haya capturas o video reales.
//
//  Más adelante, cuando haya muchos proyectos o quieran editarlos sin tocar
//  código, esta lista se puede migrar a Supabase sin cambiar el diseño.
// ─────────────────────────────────────────────────────────────────────────

export const proyectos = [
  {
    slug: "forja-gym",
    titulo: "FORJA — Club de Fuerza",
    categoria: "Gimnasio · Sitio con 3D interactivo",
    anio: 2026,
    estado: "publicado",
    resumen:
      "Un gimnasio inventado para mostrar cómo se ve una web con identidad propia y una escena 3D como sello.",
    descripcion: [
      "FORJA es un proyecto de demostración: un gimnasio y todos sus datos (nombre, ubicación, entrenadores, planes) son inventados, pensados solo para mostrar lo que Sitewell puede construir para un negocio real de este tipo.",
      "Tiene su propia identidad visual completa —tipografía, colores y una escena 3D de una barra de pesas— totalmente distinta a la de Sitewell, porque así se vería el sitio de un cliente de verdad.",
    ],
    tecnologias: ["Next.js", "Three.js", "WebGL"],
    enlace: "/forja-gym",
    portada: { desde: "#3a0f02", hasta: "#ff5a1f" },
  },
  {
    slug: "sitewell",
    titulo: "Sitewell",
    categoria: "Sitio corporativo · Portafolio",
    anio: 2026,
    estado: "en-desarrollo",
    resumen:
      "Este mismo sitio: nuestra vitrina y el primer experimento de lo que podemos hacer con 3D en la web.",
    descripcion: [
      "El portafolio de Sitewell es la prueba de lo que ofrecemos: un sitio con una escena 3D interactiva real, no una imagen decorativa.",
      "Está pensado para cargar rápido, respetar a quienes prefieren menos movimiento y funcionar bien también en celulares modestos.",
    ],
    tecnologias: ["Next.js", "Three.js", "WebGL"],
    enlace: null,
    portada: { desde: "#2a1f8a", hasta: "#0e3b46" },
  },
];

// Texto que se muestra para cada valor de "estado".
export const ETIQUETA_ESTADO = {
  publicado: "Publicado",
  "en-desarrollo": "En desarrollo",
};

// Devuelve un proyecto por su slug, o undefined si no existe.
export function buscarProyecto(slug) {
  return proyectos.find((p) => p.slug === slug);
}
