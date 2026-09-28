"use client";

import { useState } from "react";
import MarcaForja from "./MarcaForja";
import { forja } from "@/data/forjaGym";

const enlaces = [
  { href: "#programas", texto: "Programas" },
  { href: "#planes", texto: "Planes" },
  { href: "#entrenadores", texto: "Entrenadores" },
  { href: "#contacto", texto: "Contacto" },
];

export default function HeaderForja() {
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  return (
    <header className="fj-header">
      <div className="fj-header__barra">
        <a href="#inicio" className="fj-logo" onClick={cerrar} aria-label={`${forja.nombre}, ir al inicio`}>
          <MarcaForja />
          <span>{forja.nombre}</span>
        </a>

        <nav id="fj-menu" className={`fj-nav ${abierto ? "fj-nav--abierto" : ""}`} aria-label="Principal">
          {enlaces.map((e) => (
            <a key={e.href} href={e.href} className="fj-nav__enlace" onClick={cerrar}>
              {e.texto}
            </a>
          ))}
          <a
            href={`https://wa.me/${forja.contacto.telefono}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fj-boton fj-boton--pequeno"
            onClick={cerrar}
          >
            Clase gratis
          </a>
        </nav>

        <button
          type="button"
          className="fj-header__toggle"
          aria-expanded={abierto}
          aria-controls="fj-menu"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setAbierto((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
