import Link from "next/link";
import HeroEscena from "./HeroEscena";

export default function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-titulo">
      <HeroEscena />
      {/* Degradado que oscurece el lado del texto para que siempre se lea bien */}
      <div className="hero__velo" aria-hidden="true" />

      <div className="container hero__contenido">
        <p className="kicker hero__anim" style={{ "--i": 0 }}>
          Estudio de desarrollo web · Diseño 3D
        </p>
        <h1 id="hero-titulo" className="hero__titulo hero__anim" style={{ "--i": 1 }}>
          Webs con <em>dimensión</em>.
        </h1>
        <p className="hero__texto hero__anim" style={{ "--i": 2 }}>
          Diseñamos y desarrollamos sitios web para negocios, con experiencias 3D interactivas que
          hacen que te recuerden.
        </p>
        <div className="hero__acciones hero__anim" style={{ "--i": 3 }}>
          <Link href="/#proyectos" className="boton">
            Ver proyectos
          </Link>
          <Link href="/#contacto" className="boton boton--fantasma">
            Hablemos
          </Link>
        </div>
      </div>

      <p className="hero__nota" aria-hidden="true">
        Esto es 3D real, corriendo en tu navegador.
      </p>
    </section>
  );
}
