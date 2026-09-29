"use client";

/*
 * components/HeroEscenaHotel.js
 * Decide CUÁNDO y CÓMO cargar la escena 3D del proyecto "Hotel Meridiano".
 * Es igual a components/HeroEscena.js, solo que carga EscenaHotel3D en vez de Escena3D.
 * Se duplica (en vez de compartirse) para que la carga diferida siga funcionando: al usar
 * next/dynamic con una ruta de importación fija, Three.js solo se descarga cuando esta
 * escena en particular hace falta. Ver los comentarios de HeroEscena.js para el detalle
 * de cada regla de degradación.
 */
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// ssr: false -> el código de Three.js nunca se ejecuta en el servidor ni se incluye en la carga inicial.
const EscenaHotel3D = dynamic(() => import("@/components/EscenaHotel3D"), { ssr: false });

export default function HeroEscenaHotel({ pistaRef }) {
  const raiz = useRef(null);
  const [calidad, setCalidad] = useState(null); // null = todavía no toca cargar el 3D
  const [animar, setAnimar] = useState(true);
  const [visible, setVisible] = useState(true);
  const [lista, setLista] = useState(false);
  const [fallo, setFallo] = useState(false);

  // 1) Movimiento reducido: se lee al inicio y se actualiza si el usuario lo cambia.
  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const actualizar = () => setAnimar(!consulta.matches);
    actualizar();
    consulta.addEventListener("change", actualizar);
    return () => consulta.removeEventListener("change", actualizar);
  }, []);

  // 2) Esperar a que el navegador esté libre y decidir la calidad.
  useEffect(() => {
    const decidir = () => {
      const pocosNucleos = (navigator.hardwareConcurrency ?? 8) <= 4;
      const pocaMemoria = (navigator.deviceMemory ?? 8) <= 4; // solo existe en navegadores basados en Chromium
      const pantallaChica = window.innerWidth < 768;
      setCalidad(pocosNucleos || pocaMemoria || pantallaChica ? "baja" : "alta");
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(decidir, { timeout: 600 });
      return () => window.cancelIdleCallback(id);
    }
    // Safari no tiene requestIdleCallback.
    const id = window.setTimeout(decidir, 400);
    return () => window.clearTimeout(id);
  }, []);

  // 3) Saber si la portada se ve, para pausar el 3D cuando no.
  useEffect(() => {
    const elemento = raiz.current;
    if (!elemento || !("IntersectionObserver" in window)) return;
    const observador = new IntersectionObserver(([entrada]) => setVisible(entrada.isIntersecting));
    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={raiz} className={`escena${lista ? " escena--lista" : ""}`} aria-hidden="true">
      <div className="escena__respaldo escena__respaldo--hotel" />
      {calidad && !fallo && (
        <EscenaHotel3D
          calidad={calidad}
          animar={animar}
          visible={visible}
          pistaRef={pistaRef}
          alListo={() => setLista(true)}
          alError={() => setFallo(true)}
        />
      )}
    </div>
  );
}
