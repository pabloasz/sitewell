import HeroEscenaForja from "./HeroEscenaForja";
import { forja } from "@/data/forjaGym";

export default function HeroForja() {
  return (
    <section className="fj-hero" id="inicio" aria-labelledby="fj-hero-titulo">
      <HeroEscenaForja />
      <div className="fj-hero__velo" aria-hidden="true" />

      <div className="fj-container fj-hero__contenido">
        <p className="fj-kicker fj-hero__anim" style={{ "--i": 0 }}>
          {forja.ubicacion.direccion} · {forja.ubicacion.ciudad}
        </p>
        <h1 id="fj-hero-titulo" className="fj-hero__titulo fj-hero__anim" style={{ "--i": 1 }}>
          {forja.eslogan}
        </h1>
        <p className="fj-hero__texto fj-hero__anim" style={{ "--i": 2 }}>
          Fuerza, funcional, boxeo y nutrición en un mismo lugar. Entrenadores certificados y un plan
          para cada objetivo, desde tu primer día.
        </p>
        <div className="fj-hero__acciones fj-hero__anim" style={{ "--i": 3 }}>
          <a
            href={`https://wa.me/${forja.contacto.telefono}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fj-boton"
          >
            Agenda tu clase gratis
          </a>
          <a href="#planes" className="fj-boton fj-boton--fantasma">
            Ver planes
          </a>
        </div>
      </div>

      <p className="fj-hero__nota" aria-hidden="true">
        Esto es 3D real, corriendo en tu navegador.
      </p>
    </section>
  );
}
