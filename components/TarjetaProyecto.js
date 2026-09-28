"use client";

import Link from "next/link";
import { useRef } from "react";
import Marca from "./Marca";
import { ETIQUETA_ESTADO } from "@/data/proyectos";

// Tarjeta de un proyecto. Al pasar el mouse se inclina levemente en 3D.
// (Solo con mouse: en pantallas táctiles no hay inclinación.)
export default function TarjetaProyecto({ proyecto }) {
  const ref = useRef(null);

  const inclinar = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const caja = ref.current.getBoundingClientRect();
    const x = (e.clientX - caja.left) / caja.width - 0.5; // -0.5 … 0.5
    const y = (e.clientY - caja.top) / caja.height - 0.5;
    // Se modifican variables CSS directamente (sin re-render de React) para que sea fluido.
    ref.current.style.setProperty("--ry", `${x * 10}deg`);
    ref.current.style.setProperty("--rx", `${-y * 8}deg`);
  };

  const restablecer = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--ry", "0deg");
    ref.current.style.setProperty("--rx", "0deg");
  };

  return (
    <Link
      ref={ref}
      href={`/proyectos/${proyecto.slug}`}
      className="tarjeta"
      onPointerMove={inclinar}
      onPointerLeave={restablecer}
    >
      <div
        className="tarjeta__portada"
        style={{ "--desde": proyecto.portada.desde, "--hasta": proyecto.portada.hasta }}
      >
        <Marca size={120} className="tarjeta__marca" />
        <span className={`estado estado--${proyecto.estado}`}>{ETIQUETA_ESTADO[proyecto.estado]}</span>
      </div>
      <div className="tarjeta__cuerpo">
        <p className="tarjeta__meta">
          {proyecto.categoria} · {proyecto.anio}
        </p>
        <h3>{proyecto.titulo}</h3>
        <p>{proyecto.resumen}</p>
        <span className="tarjeta__ver">
          Ver proyecto <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
