"use client";

import Link from "next/link";
import { useState } from "react";
import Marca from "./Marca";

// Los enlaces empiezan con "/#" para que también funcionen desde las
// páginas de cada proyecto (te llevan de vuelta a la portada).
const enlaces = [
  { href: "/#servicios", texto: "Servicios" },
  { href: "/#proyectos", texto: "Proyectos" },
  { href: "/#nosotros", texto: "Nosotros" },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const cerrar = () => setAbierto(false);

  return (
    <header className="header">
      <div className="header__barra">
        <Link href="/" className="logo" onClick={cerrar} aria-label="Sitewell, ir al inicio">
          <Marca />
          <span>Sitewell</span>
        </Link>

        <nav id="menu-principal" className={`nav ${abierto ? "nav--abierto" : ""}`} aria-label="Principal">
          {enlaces.map((e) => (
            <Link key={e.href} href={e.href} className="nav__enlace" onClick={cerrar}>
              {e.texto}
            </Link>
          ))}
          <Link href="/#contacto" className="boton boton--pequeno" onClick={cerrar}>
            Hablemos
          </Link>
        </nav>

        <button
          type="button"
          className="header__toggle"
          aria-expanded={abierto}
          aria-controls="menu-principal"
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
