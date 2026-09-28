"use client";

// Conecta la escena 3D (lib/crearEscenaForja.js, Three.js puro) con React.
// Es la versión de components/Escena3D.js para el sitio de FORJA: mismo
// mecanismo, solo cambia qué archivo de la escena carga.

import { useEffect, useRef } from "react";
import { crearEscena } from "@/lib/crearEscenaForja";

export default function EscenaForja({ calidad, animar, visible, onListo, onError }) {
  const hostRef = useRef(null);
  const escenaRef = useRef(null);

  const visibleRef = useRef(visible);
  const avisosRef = useRef({ onListo, onError });
  useEffect(() => {
    visibleRef.current = visible;
    avisosRef.current = { onListo, onError };
  });

  useEffect(() => {
    let cancelado = false;

    crearEscena(hostRef.current, { calidad, animar, visible: visibleRef.current })
      .then((escena) => {
        if (cancelado) {
          escena.destruir();
          return;
        }
        escenaRef.current = escena;
        escena.setVisible(visibleRef.current);
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

  useEffect(() => {
    escenaRef.current?.setVisible(visible);
  }, [visible]);

  return <div ref={hostRef} className="fj-escena__host" />;
}
