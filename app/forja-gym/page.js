import { Bebas_Neue, Inter } from "next/font/google";
import HeaderForja from "@/components/forja/HeaderForja";
import HeroForja from "@/components/forja/HeroForja";
import Numeros from "@/components/forja/Numeros";
import Programas from "@/components/forja/Programas";
import Entrenadores from "@/components/forja/Entrenadores";
import Planes from "@/components/forja/Planes";
import ContactoForja from "@/components/forja/ContactoForja";
import FooterForja from "@/components/forja/FooterForja";
import { forja } from "@/data/forjaGym";
import "./forja.css";

// Tipografías propias de FORJA (distintas a las de Sitewell, a propósito:
// cada proyecto del portafolio debe verse como el sitio de otro negocio).
// Bebas Neue: títulos grandes y condensados, estilo gimnasio.
// Inter: texto corrido, muy legible.
const display = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-forja-display", display: "swap" });
const cuerpo = Inter({ subsets: ["latin"], variable: "--font-forja-body", display: "swap" });

export const metadata = {
  title: forja.nombreCompleto,
  description: forja.descripcion,
};

export const viewport = {
  themeColor: "#0b0705",
  colorScheme: "dark",
};

// Esta página NO usa el layout visual de Sitewell (ver components/ChromeSitio.js):
// es un sitio completo aparte, pensado para mostrarse como el de un cliente real.
export default function PaginaForjaGym() {
  return (
    <main id="contenido" className={`fj-pagina ${display.variable} ${cuerpo.variable}`}>
      <noscript>
        <style>{`.fj-hero__anim{opacity:1!important;animation:none!important}`}</style>
      </noscript>
      <HeaderForja />
      <HeroForja />
      <Numeros />
      <Programas />
      <Entrenadores />
      <Planes />
      <ContactoForja />
      <FooterForja />
    </main>
  );
}
