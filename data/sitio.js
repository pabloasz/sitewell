// Datos generales de Sitewell. Aquí se edita el texto "fijo" del sitio
// (servicios, socios, contacto) sin tocar los componentes.

export const sitio = {
  nombre: "Sitewell",
  titulo: "Sitewell — Diseño y desarrollo web con experiencias 3D",
  descripcion:
    "Estudio de desarrollo web especializado en diseño 3D interactivo para negocios que quieren dejar de parecer una plantilla.",

  // ── Contacto ─────────────────────────────────────────────────────────
  // Si se deja vacío (email: "" o whatsapp: []), la sección de contacto
  // simplemente no muestra ese botón.
  contacto: {
    email: "sitewellpro@gmail.com",
    // Un botón por número. "numero" va solo con dígitos e indicativo (57 = Colombia),
    // "visible" es como se le muestra a la persona.
    whatsapp: [
      { numero: "573011392041", visible: "+57 301 1392041" },
      { numero: "573146155609", visible: "+57 314 6155609" },
    ],
  },

  servicios: [
    {
      titulo: "Diseño web 3D",
      texto:
        "Escenas, modelos y transiciones interactivas que convierten una visita en una experiencia que se recuerda.",
    },
    {
      titulo: "Desarrollo a medida",
      texto:
        "Sitios rápidos y adaptables a cualquier pantalla, construidos desde cero. Nada de plantillas genéricas.",
    },
    {
      titulo: "Ligero en cualquier equipo",
      texto:
        "Carga diferida y versiones livianas para que el 3D se vea bien también en celulares de gama baja.",
    },
    {
      titulo: "Tu primera web, o una renovada",
      texto:
        "Si tu negocio aún no está en internet, o tu página quedó desactualizada, la ponemos al día.",
    },
  ],

  // Socios. Si quieren agregar rol o foto más adelante, se añade aquí.
  socios: [
    { nombre: "Jerónimo Gaviria", rol: "Socio fundador" },
    { nombre: "Pablo Suaza", rol: "Socio fundador" },
  ],
};
