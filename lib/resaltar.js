/*
 * lib/resaltar.js
 * Convierte "Webs con *dimensión*." en texto donde la palabra entre asteriscos
 * sale resaltada en lima. Así los títulos se editan en data/ como texto plano.
 */
import { Fragment } from "react";

export function resaltar(texto) {
  // Al partir por "*", los trozos en posición impar son los que iban entre asteriscos.
  return texto.split("*").map((trozo, i) =>
    i % 2 === 1 ? (
      <em key={i} className="resaltado">
        {trozo}
      </em>
    ) : (
      <Fragment key={i}>{trozo}</Fragment>
    ),
  );
}
