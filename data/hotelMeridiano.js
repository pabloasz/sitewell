/*
 * data/hotelMeridiano.js
 * Contenido del proyecto concepto "Hotel Meridiano": un hotel boutique FICTICIO,
 * creado solo para mostrar en el portafolio cómo se ve el diseño 3D de Sitewell
 * aplicado a un negocio de hospitalidad. No es un cliente real.
 *
 * Los títulos aceptan *asteriscos* para resaltar una palabra en dorado (ver lib/resaltar.js).
 */
export const hotelMeridiano = {
  nombre: "Hotel Meridiano",

  hero: {
    kicker: "Proyecto concepto · Hotelería",
    titulo: "Donde el mar marca la *hora*.",
    texto:
      "Un hotel boutique frente al mar, pensado desde cero para la web: calma, materiales cálidos y una escena 3D que recibe a quien entra.",
    botonPrincipal: { texto: "Ver habitaciones", href: "#habitaciones" },
    botonSecundario: { texto: "Reservar", href: "#reservar" },
    nota: "Esto también es 3D real, corriendo en tu navegador.",
  },

  habitaciones: {
    kicker: "Habitaciones",
    titulo: "Tres formas de quedarse.",
    texto: "Cada habitación se diseñó alrededor de la luz y la vista, no al revés.",
    lista: [
      {
        id: "vista-mar",
        nombre: "Vista Mar",
        texto: "Una habitación luminosa con balcón propio, de frente al horizonte.",
        etiquetas: ["Balcón privado", "Cama King", "Vista al mar"],
        portada: { desde: "#241605", hasta: "#7a4a1f" },
      },
      {
        id: "jardin",
        nombre: "Suite Jardín",
        texto: "Más espacio y una terraza baja que se abre directo al jardín interior.",
        etiquetas: ["Terraza propia", "Sala independiente", "Bañera exterior"],
        portada: { desde: "#1c241c", hasta: "#5c7a4a" },
      },
      {
        id: "meridiano",
        nombre: "Suite Meridiano",
        texto: "La más grande: dos niveles, vista panorámica y acceso directo a la piscina del piso.",
        etiquetas: ["Dos niveles", "Piscina privada", "Vista panorámica"],
        portada: { desde: "#1c1a24", hasta: "#6d5a3a" },
      },
    ],
  },

  amenidades: {
    kicker: "Amenidades",
    titulo: "Todo lo que no se ve, también se diseñó.",
    texto: "Los detalles que hacen que una estadía se sienta resuelta, no improvisada.",
    lista: [
      { icono: "piscina", titulo: "Piscina infinita", texto: "Al borde del acantilado, abierta hasta tarde." },
      { icono: "spa", titulo: "Spa", texto: "Tratamientos con materiales y aromas locales." },
      { icono: "restaurante", titulo: "Restaurante", texto: "Cocina de mar, mesa abierta desde el amanecer." },
      { icono: "playa", titulo: "Playa privada", texto: "Acceso directo, sin cruzar ninguna vía." },
      { icono: "wifi", titulo: "Wifi en todo el hotel", texto: "Rápido incluso en la playa y la piscina." },
      { icono: "traslado", titulo: "Traslados", texto: "Recogida coordinada desde el aeropuerto más cercano." },
    ],
  },

  ubicacion: {
    kicker: "Ubicación",
    titulo: "Frente a la Bahía Serena.",
    texto:
      "Meridiano queda sobre un acantilado bajo, a pie de playa, lejos del ruido pero cerca de todo lo demás.",
    destacados: [
      "Playa privada a pasos del lobby",
      "15 minutos del centro del pueblo",
      "Traslado propio desde el aeropuerto",
    ],
  },

  reservar: {
    kicker: "Reservar",
    titulo: "¿Lista tu próxima escapada?",
    texto: "En un sitio real, este botón se conectaría con el sistema de reservas del hotel.",
    notaDemo: "Hotel Meridiano es un proyecto concepto de Sitewell, no un hotel real ni un cliente.",
    botonReservar: { texto: "Reservar ahora" },
    botonSitewell: { texto: "Quiero algo así para mi negocio", href: "/#contacto" },
  },
};
