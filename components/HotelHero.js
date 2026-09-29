"use client";

/*
 * components/HotelHero.js
 * Portada del proyecto concepto "Hotel Meridiano". A diferencia de components/Hero.js,
 * esta portada tiene una "pista" de scroll más alta que la pantalla (.hotel-hero): mientras
 * se recorre, la sección queda fija (.hero--fijo) y la maqueta 3D de fondo se acerca al hotel
 * (ver lib/crearEscenaHotel.js). `pistaRef` es la referencia a esa pista: la escena la usa
 * para saber qué tanto se ha "volado". Por el useRef, este componente es de cliente (el resto
 * del texto sigue siendo estático, se pinta igual de rápido).
 */
import Link from "next/link";
import { useRef } from "react";
import HeroEscenaHotel from "@/components/HeroEscenaHotel";
import { hotelMeridiano } from "@/data/hotelMeridiano";
import { resaltar } from "@/lib/resaltar";

export default function HotelHero() {
  const { hero } = hotelMeridiano;
  const pistaRef = useRef(null);

  return (
    <div className="hotel-hero" ref={pistaRef}>
      <section className="hero hero--fijo" aria-labelledby="hotel-hero-titulo">
        <HeroEscenaHotel pistaRef={pistaRef} />
        <div className="hero__velo" aria-hidden="true" />

        <div className="container hero__contenido">
          <p className="kicker" style={{ "--i": 0 }}>
            {hero.kicker}
          </p>
          <h1 id="hotel-hero-titulo" className="hero__titulo" style={{ "--i": 1 }}>
            {resaltar(hero.titulo)}
          </h1>
          <p className="hero__texto" style={{ "--i": 2 }}>
            {hero.texto}
          </p>
          <div className="hero__acciones" style={{ "--i": 3 }}>
            <Link className="boton" href={hero.botonPrincipal.href}>
              {hero.botonPrincipal.texto}
            </Link>
            <Link className="boton boton--fantasma" href={hero.botonSecundario.href}>
              {hero.botonSecundario.texto}
            </Link>
          </div>
          <p className="hero__nota" style={{ "--i": 4 }}>
            <span className="hero__punto" aria-hidden="true" />
            {hero.nota}
          </p>
        </div>
      </section>
    </div>
  );
}
