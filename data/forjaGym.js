// ─────────────────────────────────────────────────────────────────────────
//  CONTENIDO DE "FORJA — CLUB DE FUERZA"
//
//  Este es el primer proyecto de demostración del portafolio de Sitewell:
//  un gimnasio inventado, con su propio sitio completo en /forja-gym.
//  Todo lo que hay aquí (nombre, dirección, planes, entrenadores...) es
//  ficticio, pensado solo para mostrar lo que Sitewell puede construir.
//
//  Para editar textos, precios u horarios de este proyecto, todo está en
//  este archivo. El diseño (colores, tipografía) está en
//  app/forja-gym/forja.css.
// ─────────────────────────────────────────────────────────────────────────

export const forja = {
  nombre: "FORJA",
  nombreCompleto: "FORJA — Club de Fuerza",
  eslogan: "Tu fuerza, forjada de verdad.",
  descripcion:
    "Gimnasio de fuerza y acondicionamiento en El Poblado, Medellín. Pesas, funcional, boxeo y coaching, con entrenadores certificados.",
  fundado: 2016,

  ubicacion: {
    direccion: "Cra. 35 #8A-45, El Poblado",
    ciudad: "Medellín, Colombia",
  },

  contacto: {
    telefono: "573001234567",
    telefonoVisible: "+57 300 123 4567",
    email: "hola@forjagym.co",
    instagram: "@forja.gym",
  },

  horario: [
    { dias: "Lunes a viernes", horas: "5:00 a. m. – 10:00 p. m." },
    { dias: "Sábados", horas: "7:00 a. m. – 4:00 p. m." },
    { dias: "Domingos y festivos", horas: "8:00 a. m. – 1:00 p. m." },
  ],

  // Franjas numéricas de la sección "Números".
  numeros: [
    { valor: "+10", etiqueta: "años forjando resultados en Medellín" },
    { valor: "+1.200", etiqueta: "miembros activos cada semana" },
    { valor: "32", etiqueta: "clases grupales cada semana" },
    { valor: "4.9/5", etiqueta: "calificación de nuestra comunidad" },
  ],

  programas: [
    {
      titulo: "Fuerza & Powerlifting",
      texto: "Sentadilla, press y peso muerto con técnica y progresión real, no al azar.",
    },
    {
      titulo: "Hipertrofia",
      texto: "Rutinas de volumen pensadas para construir músculo con criterio y constancia.",
    },
    {
      titulo: "Funcional",
      texto: "Circuitos de alta intensidad que retan el cuerpo entero en cada sesión.",
    },
    {
      titulo: "Boxeo & Combate",
      texto: "Técnica de boxeo y acondicionamiento sobre el saco, para todos los niveles.",
    },
    {
      titulo: "Movilidad & Recuperación",
      texto: "Trabajo de movilidad y descanso activo para entrenar mejor y lesionarte menos.",
    },
    {
      titulo: "Nutrición & Coaching",
      texto: "Acompañamiento nutricional personalizado, a la medida de tu objetivo.",
    },
  ],

  entrenadores: [
    {
      nombre: "Camila Restrepo",
      especialidad: "Fuerza & Powerlifting",
      bio: "Campeona nacional amateur. Ocho años formando atletas de fuerza desde cero.",
    },
    {
      nombre: "Andrés Zuluaga",
      especialidad: "Funcional",
      bio: "Entrenador certificado, especialista en acondicionamiento y circuitos de alta intensidad.",
    },
    {
      nombre: "Laura Gómez",
      especialidad: "Nutrición & Coaching",
      bio: "Nutricionista deportiva. Diseña planes de alimentación a la medida de cada meta.",
    },
    {
      nombre: "Santiago Osorio",
      especialidad: "Boxeo & Combate",
      bio: "Ex boxeador amateur. Enseña técnica desde el primer día hasta nivel competitivo.",
    },
  ],

  // "destacado: true" resalta el plan de en medio como el más elegido.
  planes: [
    {
      nombre: "Básico",
      precio: 89000,
      periodo: "/mes",
      destacado: false,
      caracteristicas: [
        "Acceso a sala de musculación",
        "Casillero incluido",
        "1 clase grupal por semana",
      ],
    },
    {
      nombre: "Pro",
      precio: 139000,
      periodo: "/mes",
      destacado: true,
      caracteristicas: [
        "Todo lo del plan Básico",
        "Clases grupales ilimitadas",
        "1 sesión de coaching al mes",
      ],
    },
    {
      nombre: "Elite",
      precio: 199000,
      periodo: "/mes",
      destacado: false,
      caracteristicas: [
        "Todo lo del plan Pro",
        "Entrenador personal 2 veces por semana",
        "Plan nutricional incluido",
        "Acceso al gimnasio 24/7",
      ],
    },
  ],
};

// Formatea un precio en pesos colombianos: 139000 → "$139.000"
export function formatearPrecio(valor) {
  return `$${valor.toLocaleString("es-CO")}`;
}
