# Sitewell — Portafolio

Sitio web de Sitewell: presenta la empresa y reúne los proyectos que vayamos creando.
Hecho con **Next.js (App Router, JavaScript)** y **React Three Fiber** para el 3D.

## Cómo correrlo

```bash
npm install     # solo la primera vez
npm run dev     # abre http://localhost:3000
```

Para comprobar que todo compila antes de publicar: `npm run build`.

## Cómo agregar un proyecto nuevo

1. Abre [`data/proyectos.js`](data/proyectos.js).
2. Copia el bloque de un proyecto existente y pégalo **al final de la lista**.
3. Cambia los datos (las instrucciones están explicadas al inicio del archivo).

Eso es todo: la tarjeta aparece sola en la portada y se crea su página en `/proyectos/<slug>`.

Si el proyecto es un **sitio de demostración completo** (como FORJA, un gimnasio inventado
para mostrar el estilo de Sitewell), además de su entrada en `data/proyectos.js` tiene su
propia carpeta en `app/<slug>/` con su propio diseño, sus propios componentes (en
`components/<slug>/`) y sus propios datos (en `data/<slug>.js`). Ese sitio no lleva el
header ni el footer de Sitewell —se ve como el de otro negocio—, lo cual se controla en
[`components/ChromeSitio.js`](components/ChromeSitio.js). El campo `enlace` en
`data/proyectos.js` apunta a esa ruta (ej. `/forja-gym`).

## Cómo cambiar textos, servicios, socios o datos de contacto

Todo está en [`data/sitio.js`](data/sitio.js). El correo y los números de WhatsApp
de la sección de contacto también se cambian ahí (un botón por número).

## Cómo cambiar los colores o la tipografía

- Colores: sección "Tokens" al inicio de [`app/globals.css`](app/globals.css).
  Los mismos colores del 3D están en [`lib/crearEscena.js`](lib/crearEscena.js) (constantes `LIMA`, `VIOLETA`, `CIAN`).
- Tipografías: [`app/layout.js`](app/layout.js).

## Estructura

```
app/                  Páginas y estilos globales
  page.js             Portada (orden de las secciones)
  proyectos/[slug]/   Página de cada proyecto
components/           Piezas de la interfaz
  HeroEscena.js       Decide cómo y cuándo cargar el 3D (rendimiento)
  Escena3D.js         Conecta la escena 3D con React
lib/
  crearEscena.js      La escena 3D en sí (Three.js): núcleo, ventanas, luces, animación
data/                 Contenido editable (proyectos, textos)
```

## Rendimiento y accesibilidad del 3D

La escena de la portada se adapta sola. Está hecha con **Three.js directo** (sin React Three
Fiber) a propósito: React Three Fiber obliga a incluir toda la librería, y así el 3D pesa
casi la mitad (~135 KB comprimidos en vez de ~250 KB).

**Al cargar** (`components/HeroEscena.js`)

- El código 3D se descarga **después** del texto, cuando el navegador está libre.
- Los shaders se compilan en segundo plano y el arranque se reparte en tareas cortas,
  para que la página no se congele.
- En equipos modestos o celulares usa una versión más liviana (menos objetos, menos resolución).
- Si el navegador no soporta WebGL, se queda un fondo de degradado y la nota "3D real" se oculta.
- Si la persona pidió "reducir movimiento" en su sistema, la escena se muestra quieta.

**Mientras corre** (`lib/crearEscena.js`)

- Cada ventana se dibuja en 2 piezas en vez de ~13, y todas comparten geometrías y materiales
  (15 llamadas de dibujo por cuadro, antes 81).
- **Resolución adaptativa:** si el equipo no llega a unos ~38 cuadros por segundo, la resolución
  baja sola un escalón (nunca sube, para que no haya vaivenes).
- **Límite de ~60 cuadros por segundo:** en pantallas de 120/144 Hz dibuja la mitad de los
  refrescos, porque el doble no se nota y gasta batería.
- Se detiene por completo cuando la portada sale de pantalla, y al ocultar la pestaña.
- El header no usa "vidrio esmerilado" (`backdrop-filter`), que se recalcularía en cada cuadro.

## Publicar (Vercel)

1. Subir el proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → *Add New Project* → importar el repositorio.
3. Vercel detecta Next.js automáticamente; no hace falta configurar nada más.

## Ideas para más adelante

- Migrar `data/proyectos.js` a **Supabase** para poder agregar proyectos sin tocar código.
- Capturas o video reales en cada proyecto (hoy la portada usa un degradado con el logo).
- Modelos 3D propios (`.glb`) cargados de forma diferida.
- Formulario de contacto conectado a Supabase.
