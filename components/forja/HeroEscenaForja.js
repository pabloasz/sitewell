"use client";

// Envoltorio de la escena 3D de FORJA. Decide cómo y cuándo mostrarla:
// misma estrategia que components/HeroEscena.js (ver ese archivo para el
// detalle de cada decisión) — aquí solo cambia el componente de la escena.

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const EscenaForja = dynamic(() => import("./EscenaForja"), { ssr: false });

export default function HeroEscenaForja() {
  const raiz = useRef(null);
  const [config, setConfig] = useState(null);
  const [visible, setVisible] = useState(true);
  const [lista, setLista] = useState(false);
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const equipoModesto =
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      (navigator.deviceMemory ?? 8) <= 4 ||
      window.innerWidth < 768;
    const cargar = () =>
      setConfig({ calidad: equipoModesto ? "baja" : "alta", animar: !reducirMovimiento });

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(cargar, { timeout: 600 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(cargar, 400);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const observador = new IntersectionObserver(([entrada]) => setVisible(entrada.isIntersecting));
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={raiz} className={`fj-escena ${lista ? "fj-escena--lista" : ""}`} aria-hidden="true">
      <div className="fj-escena__respaldo" />
      {config && !fallo && (
        <div className="fj-escena__lienzo">
          <EscenaForja
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
