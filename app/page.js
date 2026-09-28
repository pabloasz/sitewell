import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import Proyectos from "@/components/Proyectos";
import Nosotros from "@/components/Nosotros";
import Contacto from "@/components/Contacto";

// Portada: las secciones se muestran en este orden.
export default function Inicio() {
  return (
    <>
      <Hero />
      <Servicios />
      <Proyectos />
      <Nosotros />
      <Contacto />
    </>
  );
}
