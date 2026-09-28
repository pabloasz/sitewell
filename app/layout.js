import { Archivo, Space_Grotesk } from "next/font/google";
import ChromeSitio from "@/components/ChromeSitio";
import { sitio } from "@/data/sitio";
import "./globals.css";

// Tipografías: Space Grotesk para títulos, Archivo para el texto corrido.
// next/font las descarga al compilar y las sirve desde el propio sitio (más rápido y privado).
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const cuerpo = Archivo({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata = {
  title: {
    default: sitio.titulo,
    template: `%s · ${sitio.nombre}`, // en páginas internas: "Proyecto · Sitewell"
  },
  description: sitio.descripcion,
};

export const viewport = {
  themeColor: "#07070b",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${display.variable} ${cuerpo.variable}`}>
      <body>
        {/* Si el navegador no ejecuta JavaScript, mostramos todo sin animaciones de aparición */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.hero__anim{opacity:1!important;animation:none!important}`}</style>
        </noscript>
        <a href="#contenido" className="saltar">
          Saltar al contenido
        </a>
        <ChromeSitio>{children}</ChromeSitio>
      </body>
    </html>
  );
}
