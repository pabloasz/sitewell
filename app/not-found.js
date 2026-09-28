import Link from "next/link";

export const metadata = { title: "Página no encontrada" };

export default function NoEncontrada() {
  return (
    <section className="seccion">
      <div className="container proyecto__vacio">
        <p className="kicker">Error 404</p>
        <h1 className="proyecto__titulo">Esta página no existe.</h1>
        <p className="seccion__texto">Puede que el enlace esté mal escrito o que el proyecto ya no esté disponible.</p>
        <Link href="/" className="boton">
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
