"use client";

// Envoltorio de la escena 3D. Su trabajo es decidir CÓMO y CUÁNDO mostrar el 3D:
//
//  • Cuándo: espera a que el navegador termine lo urgente (pintar el texto)
//    y solo entonces descarga el código 3D (el más pesado del sitio).
//  • Equipo modesto      → calidad "baja" (menos objetos y menos resolución).
//  • Movimiento reducido → una imagen fija, sin animación (accesibilidad).
//  • Sin WebGL / error   → se queda el fondo de degradado (nunca queda vacío).
//  • Portada fuera de vista → se detiene el dibujado para no gastar batería.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Escena3D = dynamic(() => import("./Escena3D"), { ssr: false });

export default function HeroEscena() {
  const raiz = useRef(null);
  const [config, setConfig] = useState(null); // null = todavía no toca cargar el 3D
  const [visible, setVisible] = useState(true);
  const [lista, setLista] = useState(false); // true cuando la escena ya dibujó
  const [fallo, setFallo] = useState(false);

  // 1) Decidir la calidad y programar la carga para cuando el navegador esté libre.
  useEffect(() => {
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const equipoModesto =
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      (navigator.deviceMemory ?? 8) <= 4 ||
      window.innerWidth < 768;
    const cargar = () =>
      setConfig({ calidad: equipoModesto ? "baja" : "alta", animar: !reducirMovimiento });

    // requestIdleCallback no existe en Safari: allí usamos un pequeño retraso.
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(cargar, { timeout: 600 }); // como mucho 0.6 s de espera
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(cargar, 400);
    return () => window.clearTimeout(id);
  }, []);

  // 2) Detener el dibujado cuando la portada sale de pantalla.
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const observador = new IntersectionObserver(([entrada]) => setVisible(entrada.isIntersecting));
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={raiz} className={`escena ${lista ? "escena--lista" : ""}`} aria-hidden="true">
      {/* Fondo de respaldo: siempre está debajo y se ve mientras carga el 3D */}
      <div className="escena__respaldo" />
      {config && !fallo && (
        <div className="escena__lienzo">
          <Escena3D
            calidad={config.calidad}
            animar={config.animar}
            visible={visible}
            onListo={() => setLista(true)}
            onError={() => setFallo(true)}
          />
        </div>
      )}
    </div>
  );
}
