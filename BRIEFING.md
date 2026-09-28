# Sitewell — Briefing completo para el agente de código

> Foto del proyecto el **25-sep-2026, ~10:05 (hora Colombia)**.
> Otra sesión de Claude Code ("Portafolio de proyectos empresarial") **seguía optimizando el 3D** cuando se escribió esto
> (`lib/crearEscena.js` y `components/HeroEscena.js` cambiaban minuto a minuto).
> Antes de apoyarte en un detalle del 3D, **relee el archivo real**. Todo lo demás es estable.

---

## 1. Negocio

- **Sitewell** es una empresa de desarrollo de páginas web, en sociedad entre **Jerónimo Gaviria** y **Pablo Suaza**. Mercado: Colombia (indicativo +57).
- Vende sitios a negocios que **no tienen presencia en internet o la tienen desactualizada**.
- **Diferenciador: diseño 3D interactivo** aplicado a sitios web (modelos, escenas, animaciones, transiciones), frente a la competencia de plantillas genéricas.
- **Fase 1 (en curso):** el portafolio de la empresa. Es la pieza de venta principal: debe demostrar en carne propia el 3D que se les va a vender a los clientes.
- **Fase 2 (en paralelo):** investigar negocios que puedan necesitar web y armar una lista de prospectos (ver sección 10).
- **Pablo** es un desarrollador asistido por IA, sin formación formal en programación. El código debe ser **claro y comentado en los puntos no triviales**, para que pueda mantenerlo con Claude Code.
- El `CLAUDE.md` de `C:\Users\user\Desktop\Sitewell\` resume este contexto. Las sugerencias técnicas de ese archivo son puntos de partida, no decisiones cerradas.

## 2. Estado y advertencias

- **La carpeta no es un repositorio git.** No hay historial ni respaldo. Si vas a hacer un cambio grande, avisa antes.
- **Otra sesión edita esta carpeta en paralelo** (ver el aviso de arriba). No edites `lib/crearEscena.js`, `components/Escena3D.js`, `components/HeroEscena.js` ni `app/globals.css` sin releerlos justo antes, y avisa si vas a tocarlos.
- Un servidor `next dev` puede estar corriendo en el **puerto 3000** (proceso `node.exe` de este proyecto). No lo mates; reutilízalo.
- El sitio **compila sin errores** (lo verificó la sesión que lo construyó con `npm run build`). El 3D se verificó con Edge sin interfaz (render por software), **no en una tarjeta gráfica real ni en un celular físico**.
- **El `README.md` está desactualizado** respecto al 3D: todavía habla de React Three Fiber y de las constantes de color en `Escena3D.js`. La fuente de verdad es este documento y el código.
- Sin despliegue, sin git, sin Supabase, sin formulario de contacto.

## 3. Stack real

| Cosa | Valor |
|---|---|
| Framework | Next.js **16.3.6** (App Router), **solo JavaScript, sin TypeScript** |
| UI | React **19.3.0** + react-dom 19.3.0 |
| 3D | **three 0.186.1 usado directamente** (sin React Three Fiber ni drei; se quitaron en la optimización) |
| Estilos | **CSS plano en un solo archivo** (`app/globals.css`). Sin Tailwind, sin CSS-in-JS |
| Alias | `@/*` → raíz del proyecto (`jsconfig.json`) |
| Tipografías | `next/font/google`: **Space Grotesk** (títulos) y **Archivo** (texto), en `app/layout.js` |
| Scripts | `npm run dev`, `npm run build`, `npm run start`. **No hay lint ni tests** |
| Config Next | `reactStrictMode: true` |
| Dev server | `.claude/launch.json`, entrada `sitewell-dev` (`npm run dev`, puerto 3000) |
| Destino previsto | Vercel (Next.js se detecta solo) |
| Backend previsto | Supabase (todavía no integrado) |

Dependencias exactas (`package.json`): `next ^16.3.6`, `react ^19.3.0`, `react-dom ^19.3.0`, `three ^0.186.1`.

Idioma de todo el proyecto: **español** (comentarios, nombres de clases, variables y textos).

## 4. Estructura de archivos

```text
Sitewell/
  CLAUDE.md                              briefing de negocio (sugerencias técnicas)
  Sitewell_Prospectos_Girardota.xlsx     lista de prospectos (Fase 2)
  Desarrollo web/                        ← proyecto Next.js
    BRIEFING.md                          este documento
    README.md                            cómo correr / agregar proyectos (parte desactualizada, ver §2)
    package.json  jsconfig.json  next.config.js  .gitignore
    .claude/launch.json                  servidor de prueba "sitewell-dev"
    app/
      layout.js                          fuentes, metadata, viewport, <noscript>, "saltar al contenido", Header/Footer
      page.js                            orden: Hero → Servicios → Proyectos → Nosotros → Contacto
      proyectos/[slug]/page.js           una página por proyecto (generateStaticParams)
      not-found.js                       404
      globals.css                        TODO el CSS (tokens en la sección 1 del archivo)
      icon.svg                           favicon (cubo isométrico)
    components/
      Hero.js                            portada: texto + botones + <HeroEscena/>
      HeroEscena.js                      decide CUÁNDO y CÓMO cargar el 3D (cliente)
      Escena3D.js                        puente React ↔ Three.js (cliente)
      Header.js  Footer.js  Marca.js     marco del sitio y logo
      Servicios.js  Proyectos.js  TarjetaProyecto.js  Nosotros.js  Contacto.js
      Reveal.js                          aparición al hacer scroll (cliente)
    lib/
      crearEscena.js                     la escena 3D en Three.js puro (sin React)
    data/
      sitio.js                           textos fijos, servicios, socios, contacto
      proyectos.js                       lista de proyectos, ETIQUETA_ESTADO, buscarProyecto()
    public/                              vacío
```

## 5. Convenciones de código

1. **Contenido separado del diseño.** Textos y datos editables viven en `data/`; los componentes solo los pintan. Agregar un proyecto = copiar un bloque al final de `data/proyectos.js`; la tarjeta y `/proyectos/<slug>` aparecen solas.
2. **Server Components por defecto.** Solo llevan `"use client"`: `Header`, `Reveal`, `TarjetaProyecto`, `HeroEscena`, `Escena3D`. Todo lo demás es servidor.
3. **Clases CSS en español, estilo BEM**: `.hero__titulo`, `.boton--fantasma`, `.tarjeta--invitacion`. Cada componente usa su bloque.
4. **Comentarios en español que explican el porqué**, no el qué. Encabezado explicativo al inicio de cada archivo no trivial.
5. **`params` se espera con `await`** en páginas dinámicas (Next 15+).
6. **Enlaces internos como `/#seccion`**, para que funcionen también desde las páginas de proyecto.
7. **Colores en un solo lugar:** tokens en `app/globals.css`. Los del 3D (`LIMA`, `VIOLETA`, `CIAN`) están **duplicados en `lib/crearEscena.js`** y **deben coincidir**.
8. **Imports con alias** `@/components/...`, `@/data/...`, `@/lib/...`.
9. **Quirks conocidos (no rompen nada):** `.hero__acciones` y `.seccion__texto` se reutilizan en Contacto; `.seccion--contacto` no tiene regla CSS; `icon.svg` y `Marca.js` dibujan el cubo con coordenadas ligeramente distintas.

## 6. Sistema de diseño

**Carácter:** oscuro y tecnológico, con acento lima eléctrico y violeta/cian de apoyo. Mucho aire, bordes finos translúcidos, tipografía grande. Header en píldora flotante con blur. `color-scheme: dark`; **no hay modo claro**.

### Tokens (`:root` en `app/globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#07070b` | fondo de la página |
| `--surface` / `--surface-2` | `#11111a` / `#181824` | tarjetas / hover |
| `--line` | `rgba(255,255,255,.1)` | bordes |
| `--text` | `#f3f4f8` | texto principal |
| `--text-soft` | `#c9cbd8` | texto secundario |
| `--muted` | `#a3a6b8` | texto atenuado |
| `--accent` | `#b6ff3c` (lima) | botones, kickers, foco, detalles |
| `--accent-ink` | `#0a0d02` | texto sobre el acento |
| `--violet` | `#6d5cff` | avatares, brillos |
| `--cyan` | `#22d3ee` | avatares, brillos |
| `--radius` | `22px` | tarjetas (contacto 32px, portada de proyecto 28px, botones/chips 999px) |
| `--maxw` | `1180px` | ancho máximo (`.container` = `min(100% - 32px, 1180px)`) |
| `--ease` | `cubic-bezier(.2,.7,.2,1)` | animaciones |
| z-index | `--z-contenido:2`, `--z-header:50`, `--z-saltar:100` | escala de capas |
| Estado "en desarrollo" | `#ffb020` | punto del chip de estado |

Los nombres `--font-display` y `--font-body` los define `next/font` en `layout.js`; el CSS los usa mediante `--f-display` y `--f-body`.

### Tipografía

- Títulos: **Space Grotesk**, peso 600, `line-height` 1.1, `letter-spacing` −0.02em.
- Cuerpo: **Archivo**, `1.0625rem`, `line-height` 1.6.
- Tamaños grandes con `clamp()`: h1 de portada 3.1–6rem; h2 de sección 1.9–3.2rem; título de contacto 2.1–4.2rem; título de proyecto 2.6–5rem.
- **Kicker:** etiqueta en mayúsculas, `letter-spacing` 0.12em, color lima, con una línea de 22px delante. Se compacta bajo 480px.

### Piezas reutilizables

- `.boton`: píldora lima, mínimo 52px de alto, halo lima al hover. `--pequeno` 44px; `--fantasma` transparente con borde (hover: borde y texto lima).
- `.tarjeta`: se inclina en 3D con el mouse mediante las variables CSS `--rx` / `--ry` (perspectiva 900px). Variante `--invitacion` con borde punteado.
- `.estado`: chip translúcido con punto de color (lima = publicado, ámbar = en desarrollo).
- `.reveal` / `.reveal--visible`: aparición con desvanecimiento y desplazamiento de 28px.
- `.seccion`: `padding-block: clamp(72px, 10vw, 140px)`. `.seccion--alt` usa fondo con degradado sutil.
- `.saltar`: enlace "Saltar al contenido", visible solo al enfocarlo.

### Breakpoints

- **480px:** kicker compacto.
- **820px:** menú en línea (sin hamburguesa) y hero con texto a la izquierda.
- **900px:** layouts de dos columnas en Nosotros y en la página de proyecto.

### Logo (`Marca.js`)

Cubo isométrico en SVG (guiño al 3D). El contorno usa `currentColor` y las aristas internas `var(--accent)`. También se reutiliza como "portada" de cada proyecto, sobre un degradado propio (`--desde` → `--hasta`; el de Sitewell es `#2a1f8a` → `#0e3b46`).

### Tono de voz

Tutea y habla en primera persona plural ("Diseñamos…", "Hablemos"). Directo, sin humo. **No se inventan clientes, cifras, testimonios ni datos de contacto.** El único proyecto es el propio sitio, marcado "En desarrollo".

## 7. Contenido y funcionalidades por sección

- **Header** (fijo, píldora flotante a 16px del borde): logo + enlaces Servicios / Proyectos / Nosotros + botón "Hablemos". En celular, hamburguesa con menú desplegable (`aria-expanded`, `aria-controls`); cada enlace lo cierra.
- **Hero** (`min-height: 100svh`): kicker "Estudio de desarrollo web · Diseño 3D". H1 "Webs con *dimensión*." (la palabra en lima). Texto: "Diseñamos y desarrollamos sitios web para negocios, con experiencias 3D interactivas que hacen que te recuerden." Botones "Ver proyectos" y "Hablemos". Nota inferior: "Esto es 3D real, corriendo en tu navegador." El texto entra escalonado con la variable `--i`. Un velo degradado oscurece el lado del texto para que siempre se lea. En celular el texto queda abajo y la escena arriba.
- **Servicios** — "Páginas web que no se parecen a una plantilla." Cuatro tarjetas numeradas 01–04: *Diseño web 3D*, *Desarrollo a medida*, *Ligero en cualquier equipo*, *Tu primera web, o una renovada*.
- **Proyectos** (fondo alterno) — "Cada sitio que construimos vive aquí." Cuadrícula de tarjetas + una **tarjeta de invitación** siempre al final ("Tu negocio podría estar aquí.", lleva a `/#contacto`).
- **Página de proyecto** (`/proyectos/[slug]`): enlace "← Todos los proyectos", kicker `categoría · año`, título, resumen, portada, descripción (lista de párrafos) y panel lateral con Estado / Año / Tecnologías y botón "Visitar sitio" (solo si `enlace` no es `null`). Metadata propia por proyecto.
- **Nosotros** — "Dos socios y una idea fija: que las webs dejen de ser planas." Una tarjeta por socio, con las iniciales como avatar de degradado violeta→cian.
- **Contacto** — "¿Hablamos de tu *próxima web*?" Botón `mailto:` a **sitewellpro@gmail.com** y un botón `wa.me` por número: **+57 301 1392041** (`573011392041`) y **+57 314 6155609** (`573146155609`). Si no hubiera ningún canal configurado muestra "Estamos terminando de configurar nuestros canales de contacto."
- **Footer:** logo + "© {año} Sitewell · Jerónimo Gaviria y Pablo Suaza".
- **404** (`not-found.js`): "Esta página no existe." con botón "Volver al inicio".

### Esquemas de datos

`data/sitio.js` exporta `sitio`:
`{ nombre, titulo, descripcion, contacto: { email, whatsapp: [{ numero, visible }] }, servicios: [{ titulo, texto }], socios: [{ nombre, rol }] }`.
Si `email` es `""` o `whatsapp` es `[]`, Contacto simplemente omite esos botones.

`data/proyectos.js` exporta `proyectos`, `ETIQUETA_ESTADO` y `buscarProyecto(slug)`. Cada proyecto:
`{ slug, titulo, categoria, anio, estado ("publicado" | "en-desarrollo"), resumen, descripcion: [párrafos], tecnologias: [...], enlace (URL | null), portada: { desde, hasta } }`.
`slug` en minúsculas, sin tildes ni espacios, único. Agregar los proyectos **al final** de la lista.

Metadata global (`layout.js`): título por defecto "Sitewell — Diseño y desarrollo web con experiencias 3D"; plantilla `%s · Sitewell`; `lang="es"`; `themeColor #07070b`; `colorScheme: dark`.

## 8. La escena 3D (arquitectura actual)

**Tres capas, de fuera hacia dentro:**

1. **`components/HeroEscena.js`** (cliente) decide **cuándo y cómo**:
   - Espera a que el navegador esté libre (`requestIdleCallback`, tope 600 ms; en Safari, `setTimeout` de 400 ms) y solo entonces descarga el 3D con `next/dynamic` (`ssr: false`).
   - Calidad **baja** si `hardwareConcurrency ≤ 4`, `deviceMemory ≤ 4` o `innerWidth < 768`; si no, **alta**.
   - `prefers-reduced-motion` → `animar: false` (imagen fija).
   - Si la escena falla (por ejemplo, sin WebGL), `onError` deja el **fondo de degradado** (`.escena__respaldo`), que además siempre está debajo mientras carga: nunca queda vacío.
   - Un `IntersectionObserver` marca la portada como visible o no.
   - El lienzo entra con un fundido (`.escena--lista`).
2. **`components/Escena3D.js`** (cliente) es el puente React ↔ Three.js. Crea la escena en un `useEffect` (se rehace solo si cambia `calidad` o `animar`), guarda `visible` y los avisos en *refs* para no recrearla por cambios menores, cancela si React desmonta a mitad de la compilación, y pausa/reanuda al cambiar `visible`.
3. **`lib/crearEscena.js`** es **Three.js puro, sin React**. `crearEscena(host, { calidad, animar, visible })` devuelve una promesa con `{ setVisible(bool), destruir() }`.

**Por qué Three.js directo:** según el comentario del propio archivo, React Three Fiber arrastraba toda la librería (~250 KB comprimidos) y el uso directo deja solo lo necesario (~135 KB). Es una decisión deliberada de rendimiento: **no vuelvas a R3F/drei**.

**Composición:**
- **Núcleo:** icosaedro de radio 1.05 (detalle 5 en alta, 3 en baja) con `MeshStandardMaterial` violeta (emisivo `#2a1f8a`) al que se le inyecta una **deformación en el vertex shader** vía `onBeforeCompile` (uniformes `uTiempo`, `uDeformacion`; amplitud 0.45; también inclina las normales para que la luz siga la onda). Deformación 0.38 animado / 0.2 estático. Sobre él, una malla de alambre lima (icosaedro detalle 1, escala 1.42, opacidad 0.4) que gira.
- **Anillo de ventanas de navegador:** 6 en alta, 4 en baja, radio 3, anillo inclinado 0.22 rad, alturas alternas ±0.45, mirando hacia afuera, acentos lima/violeta/cian. Cada ventana es un `RoundedBoxGeometry(1.9, 1.25, 0.08)` + **una sola pieza de contenido con colores por vértice** (barra, puntos, bloque de color, líneas de "texto", tarjeta lateral, fila inferior). Geometrías y materiales se comparten entre ventanas; las ventanas "flotan" con senos animados a mano.
- **Partículas** (solo en alta): 70 puntos lima, mezcla aditiva, 2.2 px, sin atenuación por distancia.
- **Luces:** ambiente 0.7; direccional 2.4 en `(4,5,6)`; puntual violeta 60 en `(-5,-2,4)`; puntual lima 25 en `(5,3,-3)`.
- **Cámara:** perspectiva fov 45, en `(0,0,8)`. Renderer: antialias solo en alta, `alpha: true`, tone mapping ACES Filmic, `powerPreference: "default"` (a propósito: forzar la GPU dedicada gastaba batería y causaba un tirón inicial).
- **Interacción:** el conjunto se inclina hacia el cursor (`x·0.35`, `−y·0.2`, con `MathUtils.damp`, factor 3). Usa `window.innerWidth/innerHeight`, no mide el canvas en cada movimiento, e **ignora el táctil**.
- **Colocación adaptativa** (`ubicar()`): escritorio → escena a la derecha (`x = mitadAncho·0.42`); celular / canvas <820px → arriba y centrada (`y = mitadAlto·0.32`). Escala `min(1, disponible/4.3)` para que el anillo nunca se corte. Se reajusta con `ResizeObserver`.

**Medidas de rendimiento ya implementadas (conservarlas todas):**
- Resolución: `min(devicePixelRatio, 1.75 alta | 1.25 baja)`; **adaptativa**: si más del 60 % de los últimos 60 cuadros tardan >26 ms baja 0.25, con mínimo 0.75. Solo baja, nunca sube.
- **Tope de ~60 fps** decidido por tiempo (mide el refresco real con la mediana de 30 intervalos): en pantallas de 120/144/240 Hz dibuja uno de cada dos/cuatro. `dt` máximo 0.05 s para que no haya saltos tras una pausa.
- Arranque repartido en tareas cortas (`ceder()` con `setTimeout 0`) y shaders con **`compileAsync`** para no congelar la página. Los primeros 45 cuadros no cuentan para el monitoreo.
- **Pausa total** (`cancelAnimationFrame` y se quita el listener) cuando la portada no se ve.
- Modo estático (`animar: false`): un solo cuadro; se redibuja solo si cambia el tamaño.
- `destruir()` libera todo: recursos registrados, `renderer.dispose()`, `forceContextLoss()` y `canvas.remove()`.
- CSS: `.escena { contain: strict; }` aísla la capa para que sus repintados no afecten al resto; `.escena__canvas { touch-action: pan-y; }` mantiene el scroll en celular.
- Pocas llamadas de dibujo (cada ventana se fusiona en 2 piezas en vez de ~13).

**Regla:** cualquier cambio a la escena debe conservar todas las ramas de degradación (sin WebGL, calidad baja, movimiento reducido, pausa fuera de pantalla, destrucción limpia).

## 9. Accesibilidad y rendimiento (obligatorio)

Vienen del checklist de la skill `ui-ux-pro-max` y ya están implementados:

- Enlace "Saltar al contenido", `lang="es"`, `aria-labelledby` en cada sección, `aria-hidden` en lo decorativo (3D, iconos, flechas, portadas).
- `:focus-visible` con contorno lima de 2px; objetivos táctiles ≥ 44px; contraste alto sobre fondo oscuro.
- **`prefers-reduced-motion`**: apaga animaciones y transiciones, muestra `.reveal` de inmediato, desactiva la inclinación de tarjetas y deja el 3D quieto.
- **`<noscript>`** en `layout.js`: sin JavaScript, todo se muestra sin animaciones de aparición.
- **Nunca scroll horizontal** (`overflow-x: clip`).
- Solo se animan `transform` y `opacity`.
- `scroll-behavior: smooth` y `scroll-padding-top: 96px` para que el header flotante no tape los títulos al saltar a una sección.
- La inclinación de tarjetas es **solo con mouse** (`pointerType === "mouse"`) y se actualiza con variables CSS, sin re-render de React.
- El texto se pinta primero; el 3D (lo más pesado) llega después y en segundo plano.

## 10. Fase 2: prospectos

Archivo: `C:\Users\user\Desktop\Sitewell\Sitewell_Prospectos_Girardota.xlsx` (generado con `openpyxl`; no consta en las sesiones locales qué skill lo produjo).

- **Hoja "Resumen":** 38 negocios de **Girardota (Antioquia)** → Alta **16**, Media **7**, Baja **10**, Descartar **5**. Incluye instrucciones de uso.
- **Hoja "Prospectos - Girardota":** columnas *Nombre, Categoría, Dirección, Teléfono, N° reseñas Maps, ¿Tiene web?, Puntaje (0–8), Prioridad, Por qué encaja con 3D, Estado* (lista desplegable; hoy todos "Por contactar") *y Notas*.
- **Prioridad Alta (puntaje 7–8):** negocios **sin web propia** que encajan bien con 3D. Son 16: Benevento, Creaciones Pineda, Salón De Eventos Masierra, Centro de Eventos y Convenciones el Castillo de Santa Marta, Loma Linda-Salón Francés, Centro Montserrat, Restaurante Los Antojos, Restaurante Kike Brunch, Asados de La Pampa, La Curva del Gordo, La Reina, Cellcomputo Hogar, Motos Nico Girardota, Aguilas Gym, Brutal Gym, AKT Motos Girardota.
- **Descartar:** los que ya tienen web y son franquicia o marca nacional (OROEXPRESS, Yamaha, Auteco Mobility, Bajaj Grupo UMA, Auteco Motos del Darién).
- **Ángulo de venta por categoría** (columna "Por qué encaja con 3D"): salones de eventos → preview 3D del espacio decorado; restaurantes → ambiente y menú en 3D; fincas/hoteles → tour virtual 3D; gimnasios → recorrido 3D de instalaciones; constructoras → renders y recorridos de proyectos; muebles → catálogo 3D; joyería → piezas con zoom/rotación.
- **Hoja "Zona secundaria":** 4 glamping en municipios vecinos (All Natural Glamping, AKOA Glamping, Glamping La Veranera, La Pascana Eco-lodge), para cuando la lista principal se quede corta.
- **Vacío conocido:** el "plan de investigación" con la rúbrica exacta del puntaje **no está en ningún archivo**. Si hay que ampliar la lista o puntuar de nuevo, hay que pedírsela a Pablo.

## 11. Pendientes y decisiones abiertas

- Los números de WhatsApp **no están etiquetados** por socio (no se sabe cuál es de quién).
- El rol "Socio fundador" para ambos es un texto provisional. **No hay bios ni fotos.**
- No hay capturas, video ni modelos `.glb`. La "portada" de cada proyecto es un degradado con el logo. `public/` está vacío.
- No hay Open Graph, sitemap ni robots.
- El 3D no se probó en un celular físico de gama baja ni en GPU real.
- Aviso `THREE.Clock deprecated` en consola: venía de React Three Fiber; **debería haber desaparecido** con la migración a Three.js directo (verificar).
- `README.md` desactualizado (ver §2).
- Falta: inicializar git y GitHub, publicar en Vercel, integrar Supabase (mover proyectos a base de datos sin tocar el diseño), formulario de contacto conectado (hoy solo `mailto` y `wa.me`).
- Aún no hay clientes reales: el único proyecto es el propio sitio.

## 12. Skills y herramientas

### Confirmada en la construcción del sitio

**`ui-ux-pro-max`**, invocada con la herramienta `Skill` al inicio de la sesión que creó el proyecto.
- Vive a **nivel de usuario**: `C:\Users\user\.claude\skills\ui-ux-pro-max\` (instalada el 23-jun-2026 desde `nextlevelbuilder/ui-ux-pro-max-skill`). **No está dentro del proyecto**: otro usuario o máquina no la tendría.
- Necesita **Python**. Flujo: `search.py "<producto> <estilo>" --design-system` → búsquedas por dominio (`ux`, `typography`, `nextjs`…) → checklist de entrega.
- Prioridades de la skill: accesibilidad, interacción táctil, rendimiento, layout responsive, tipografía y color, animación, estilo.
- De su salida salió el par tipográfico **Archivo / Space Grotesk** (mood "minimal, portfolio, designer, creative, clean, artistic"). La procedencia de la paleta lima/violeta/cian no se pudo confirmar: la transcripción no muestra los resultados de las herramientas.
- El sistema de diseño **no se persistió** (no existe `design-system/MASTER.md`).

**Limitación honesta:** la transcripción de esa sesión solo muestra los *nombres* de las herramientas llamadas, no sus argumentos, y solo se vio **una** invocación de `Skill`. No se puede garantizar que no hubiera otra.

### Herramientas (no son skills) usadas para verificar

Panel de navegador integrado (`preview_start`, capturas, consola, `resize_window`), Edge sin interfaz para renderizar el 3D, `next build`, PowerShell, y medición del tamaño del JavaScript en la pasada de optimización.

### Catálogo disponible en este entorno

| Relevancia | Skills |
|---|---|
| **Alta (diseño y verificación)** | `ui-ux-pro-max` (usar antes de tocar UI), `built-in-browser`, `run`, `simplify`, `code-review`, `security-review` |
| **Media (Fase 2 y entregables)** | `deep-research`, `xlsx` (editar el Excel), `docx`, `pdf`, `pptx` (propuestas y presentaciones a clientes), `docs`, `morning` |
| **Media (herramientas del agente)** | `init`, `skill-creator`, `consolidate-memory`, `import-memory`, `loop`, `schedule`, `update-config`, `fewer-permission-prompts`, `keybindings-help`, `explain-usage`, `setup-claude` |
| **Situacional** | `chrome-browser`, `computer-use`, `claude-api` (solo si el sitio llegara a usar la API de Claude), `artifact-design`, `artifact-diagramming`, `artifact-capabilities`, `dataviz` |
| **Plugin small-business** | `lead-finder`, `lead-triage`, `outreach-composer`, `proposal-builder`, `call-list`, `grow-pipeline`, `crm-autopilot`, `seo-ai-visibility`, `brand-style`, `content-strategy`, `social-content-engine`, `canva-creator`, `build-agent`, `build-connector`, `speed-to-lead`, `reactivate`, `smb-onboard`, `smb-router` y otras de contabilidad y operaciones (`ap-processor`, `cash-flow-snapshot`, `close-month`, `month-end-prep`, `payroll-prep`, `tax-prep`, `inventory-planner`, `contract-review`, etc.) |
| **Plugin render** | `render:*` (deploy, blueprints, web-services, static-sites, dominios, postgres, etc.) |
| **Plugin cowork** | `cowork-plugin-management:cowork-plugin-customizer`, `cowork-plugin-management:create-cowork-plugin` |

Notas sobre el catálogo:
- **`rave` NO aplica:** genera PHP en un estilo personal y se dispara con peticiones de PHP. Este proyecto es Next.js en JavaScript.
- **`render:*` no aplica** salvo que se cambie el destino: el plan es Vercel.
- **El resto de small-business** (contabilidad, nómina, impuestos, inventario, contratos, reseñas…) no aplica al portafolio.
- **Los conectores del plugin small-business** (HubSpot, Apollo, Gmail, Canva, Slack, etc.) requieren autorización que solo el usuario puede dar (ajustes de conectores de claude.ai). Sin ella, esas skills no pueden actuar.
- Solo se confirmó nombre y descripción de las skills que el catálogo describe; las que aparecen sin descripción se nombran sin asegurar su función.
- Subagentes disponibles: `Explore`, `Plan`, `general-purpose`, `claude-code-guide`, `statusline-setup`, `render:render-assistant`.

## 13. Reglas para el agente

1. **Invoca `ui-ux-pro-max` antes de cualquier cambio visual** y respeta los tokens. No introduzcas colores ni tipografías fuera de `globals.css` (y de las constantes gemelas de `lib/crearEscena.js`). Si la skill no está disponible, aplica los principios de la sección 9.
2. **Solo JavaScript, sin TypeScript, sin librerías de estilos.** Sigue con CSS plano y las convenciones de la sección 5.
3. **Todo en español**, comentado donde no sea obvio, pensando en que Pablo lo mantiene con IA.
4. **Contenido nuevo en `data/`**, no escrito a mano en los componentes.
5. **No inventes** clientes, cifras, testimonios, bios ni datos de contacto. Si falta un dato, pregúntalo.
6. **El 3D no puede degradarse:** carga diferida, calidad baja, movimiento reducido, pausa fuera de pantalla, fallback sin WebGL y destrucción limpia. Nada de volver a R3F/drei.
7. **Verifica antes de dar algo por terminado:** `npm run build` sin errores; revisa en el navegador integrado a escritorio y a 375px de ancho; consola limpia; sin scroll horizontal.
8. **No publiques ni subas nada** (GitHub, Vercel, Supabase, envío de correos o WhatsApp) sin que Pablo lo pida explícitamente.
9. **Coordínate con la sesión de optimización activa**: relee los archivos antes de editarlos y no pises sus cambios.
10. **No mates el servidor del puerto 3000**; si está ocupado, es de este proyecto.

## 14. Prompt para el agente (copiar y pegar)

```text
Vas a trabajar en el proyecto Sitewell, en C:\Users\user\Desktop\Sitewell\Desarrollo web.
Sitewell es una empresa de desarrollo web de Jerónimo Gaviria y Pablo Suaza (Colombia), especializada en diseño 3D interactivo. Este proyecto es su portafolio: una web Next.js (App Router, solo JavaScript) con una escena 3D real en Three.js, pensada como la pieza de venta principal. Pablo es desarrollador asistido por IA sin formación formal, así que el código debe ser claro y comentado en español.

ANTES DE TOCAR NADA:
1. Lee completos, en este orden: C:\Users\user\Desktop\Sitewell\CLAUDE.md y C:\Users\user\Desktop\Sitewell\Desarrollo web\BRIEFING.md. El BRIEFING describe el stack, la estructura, las convenciones, el sistema de diseño, la arquitectura del 3D, las reglas de accesibilidad y rendimiento, los pendientes y las skills.
2. El BRIEFING es una foto de las ~10:05 del 25-sep-2026. Otra sesión de Claude Code estaba optimizando el 3D en esta misma carpeta. Relee los archivos reales antes de editarlos (sobre todo lib/crearEscena.js, components/Escena3D.js, components/HeroEscena.js y app/globals.css). El README.md está parcialmente desactualizado; si el BRIEFING y el README se contradicen, manda el BRIEFING y el código.
3. Si vas a hacer cambios visuales, invoca primero la skill ui-ux-pro-max. Si no la tienes, aplica el checklist de accesibilidad y rendimiento de la sección 9 del BRIEFING.

REGLAS (resumen; el detalle está en la sección 13 del BRIEFING):
- Solo JavaScript (sin TypeScript) y CSS plano en app/globals.css. Nada de Tailwind ni CSS-in-JS.
- Todo en español: comentarios, nombres de clases, textos. Clases estilo BEM en español.
- Contenido editable en data/ (sitio.js, proyectos.js); los componentes solo lo pintan.
- Respeta los tokens de diseño (fondo oscuro #07070b, acento lima #b6ff3c, violeta #6d5cff, cian #22d3ee; Space Grotesk + Archivo). Los colores del 3D en lib/crearEscena.js deben coincidir con los del CSS.
- No inventes clientes, cifras, testimonios, bios ni datos de contacto. Si falta un dato, pregunta.
- El 3D no puede degradarse: mantén la carga diferida, la calidad baja para equipos modestos, el movimiento reducido, la pausa fuera de pantalla, el fallback sin WebGL, la resolución adaptativa y el tope de ~60 fps. No vuelvas a React Three Fiber ni drei.
- No hay git ni tests. Antes de dar algo por terminado: npm run build sin errores, revisión en el navegador integrado a escritorio y a 375px, consola limpia, sin scroll horizontal.
- No publiques ni subas nada (GitHub, Vercel, Supabase, correos, WhatsApp) sin que te lo pida explícitamente.
- No mates el servidor de desarrollo del puerto 3000 si está corriendo: es de este proyecto.
- La skill "rave" (PHP) no aplica a este proyecto.

CÓMO REPORTAR: resume qué cambiaste (con enlaces a los archivos), qué verificaste y cómo, y qué queda pendiente o necesita una decisión de Pablo. Sé honesto sobre lo que no pudiste probar (por ejemplo, un celular físico de gama baja).

TAREA:
[PEGA AQUÍ LO QUE QUIERES QUE HAGA]
```
