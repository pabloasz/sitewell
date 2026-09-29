"use client";

/*
 * components/EscenaHotel3D.js
 * Puente entre React y Three.js para la escena del proyecto "Hotel Meridiano".
 * Es casi igual a components/Escena3D.js (mismos comentarios aplican), salvo que usa
 * lib/crearEscenaHotel.js y le pasa `pistaRef`: la referencia del contenedor alto de scroll
 * (.hotel-hero) que la escena usa para saber cuánto se ha "volado" hacia el hotel.
 */
import { useEffect, useRef } from "react";
import { crearEscenaHotel } from "@/lib/crearEscenaHotel";

export default function EscenaHotel3D({ calidad, animar, visible, pistaRef, alListo, alError }) {
  const host = useRef(null);
  const control = useRef(null);
  const visibleRef = useRef(visible);
  const avisos = useRef({ alListo, alError });

  useEffect(() => {
    avisos.current = { alListo, alError };
  });

  // Pausar o reanudar según se vea la portada.
  useEffect(() => {
    visibleRef.current = visible;
    control.current?.setVisible(visible);
  }, [visible]);

  useEffect(() => {
    const cancelador = new AbortController();

    crearEscenaHotel(host.current, {
      calidad,
      animar,
      visible: visibleRef.current,
      elementoPista: pistaRef?.current ?? null,
      senal: cancelador.signal,
    })
      .then((escena) => {
        if (cancelador.signal.aborted) {
          escena.destruir();
          return;
        }
        control.current = escena;
        escena.setVisible(visibleRef.current);
        avisos.current.alListo?.();
      })
      .catch((error) => {
        if (cancelador.signal.aborted) return; // Cancelación normal, no es un fallo.
        console.warn("Hotel Meridiano: no se pudo iniciar la escena 3D, se usa el fondo de respaldo.", error);
        avisos.current.alError?.(error);
      });

    return () => {
      cancelador.abort();
      control.current?.destruir();
      control.current = null;
    };
  }, [calidad, animar]);

  return <div ref={host} className="escena__canvas" />;
}
