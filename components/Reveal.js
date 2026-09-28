"use client";

// Hace que su contenido aparezca suavemente cuando entra en pantalla al hacer scroll.
// Las reglas visuales están en app/globals.css (.reveal). Si el usuario prefiere
// menos movimiento, el CSS lo muestra de inmediato sin animación.

import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, retraso = 0, className = "", as: Etiqueta = "div" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect(); // solo la primera vez
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${retraso}ms` }}
    >
      {children}
    </Etiqueta>
  );
}
