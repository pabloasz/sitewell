"use client";

// Decide si se muestra el header/footer de Sitewell alrededor de la página.
//
// Los proyectos de demostración (como /forja-gym) son sitios con su propia
// identidad visual completa: no deben verse envueltos por la barra y el pie
// de página de Sitewell, porque eso rompería la ilusión de que es un sitio
// real de otro negocio. Cada uno de esos proyectos ya trae su propio header
// y footer (ver components/forja/HeaderForja.js y FooterForja.js).
//
// Para que un proyecto nuevo también sea "sin chrome de Sitewell", basta con
// agregar su ruta a RUTAS_SIN_CHROME.

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

const RUTAS_SIN_CHROME = ["/forja-gym"];

export default function ChromeSitio({ children }) {
  const pathname = usePathname();
  const esDemoPropia = RUTAS_SIN_CHROME.some((ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`));

  if (esDemoPropia) return children;

  return (
    <>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
}
