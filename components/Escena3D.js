"use client";

// Conecta la escena 3D (lib/crearEscena.js, que es Three.js puro) con React.
// Este componente solo se carga en el navegador (ver HeroEscena.js).

import { useEffect, useRef } from "react";
import { crearEscena } from "@/lib/crearEscena";

export default function Escena3D({ calidad, animar, visible, onListo, onError }) {
  const hostRef = useRef(null);
  const escenaRef = useRef(null);

  // Guardamos lo último que llegó por props en "refs" para poder leerlo dentro
  // de la creación asíncrona sin volver a crear la escena por un cambio pequeño.
  const visibleRef = useRef(visible);
  const avisosRef = useRef({ onListo, onError });
  useEffect(() => {
    visibleRef.current = visible;
    avisosRef.current = { onListo, onError };
  });

  // Crear la escena. Solo se rehace si cambia la calidad o si se pide animación distinta.
  useEffect(() => {
    let cancelado = false;

    crearEscena(hostRef.current, { calidad, animar, visible: visibleRef.current })
      .then((escena) => {
        if (cancelado) {
          escena.destruir(); // React ya nos desmontó mientras se compilaba
          return;
        }
        escenaRef.current = escena;
        escena.setVisible(visibleRef.current); // por si cambió mientras se compilaba
        avisosRef.current.onListo?.();
      })
      .catch((error) => {
        if (!cancelado) avisosRef.current.onError?.(error);
      });

    return () => {
      cancelado = true;
      escenaRef.current?.destruir();
      escenaRef.current = null;
    };
  }, [calidad, animar]);

  // Pausar / reanudar cuando la portada sale o entra de pantalla.
  useEffect(() => {
    escenaRef.current?.setVisible(visible);
  }, [visible]);

  return <div ref={hostRef} className="escena__host" />;
}
