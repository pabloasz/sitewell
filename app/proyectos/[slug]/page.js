import Link from "next/link";
import { notFound } from "next/navigation";
import Marca from "@/components/Marca";
import { ETIQUETA_ESTADO, buscarProyecto, proyectos } from "@/data/proyectos";

// Genera una página por cada proyecto de data/proyectos.js al compilar el sitio.
export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

// En Next.js 15+ "params" llega como una promesa, por eso se usa await.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const proyecto = buscarProyecto(slug);
  if (!proyecto) return {};
  return { title: proyecto.titulo, description: proyecto.resumen };
}

export default async function PaginaProyecto({ params }) {
  const { slug } = await params;
  const proyecto = buscarProyecto(slug);
  if (!proyecto) notFound(); // muestra la página 404

  return (
    <article className="proyecto">
      <div className="container">
        <Link href="/#proyectos" className="proyecto__volver">
          <span aria-hidden="true">←</span> Todos los proyectos
        </Link>

        <header className="proyecto__cabecera">
          <p className="kicker">
            {proyecto.categoria} · {proyecto.anio}
          </p>
          <h1 className="proyecto__titulo">{proyecto.titulo}</h1>
          <p className="proyecto__resumen">{proyecto.resumen}</p>
        </header>

        <div
          className="proyecto__portada"
          style={{ "--desde": proyecto.portada.desde, "--hasta": proyecto.portada.hasta }}
          aria-hidden="true"
        >
          <Marca size={220} className="tarjeta__marca" />
        </div>

        <div className="proyecto__cuerpo">
          <div className="proyecto__descripcion">
            {proyecto.descripcion.map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>

          <aside className="proyecto__datos" aria-label="Datos del proyecto">
            <dl>
              <dt>Estado</dt>
              <dd>{ETIQUETA_ESTADO[proyecto.estado]}</dd>
              <dt>Año</dt>
              <dd>{proyecto.anio}</dd>
              <dt>Tecnologías</dt>
              <dd>
                <ul className="etiquetas">
                  {proyecto.tecnologias.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
            </dl>
            {proyecto.enlace && (
              <a className="boton" href={proyecto.enlace} target="_blank" rel="noopener noreferrer">
                Visitar sitio
              </a>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}
