// ─────────────────────────────────────────────────────────────────────────
//  ESCENA 3D DE LA PORTADA (Three.js "a pelo", sin React Three Fiber)
//
//  ¿Por qué Three.js directo? React Three Fiber obliga a incluir TODA la
//  librería Three.js (~250 KB comprimidos). Usándola directamente, el
//  empaquetador solo incluye lo que realmente usamos (~135 KB): el 3D
//  llega casi al doble de rápido, sobre todo en celulares.
//
//  Composición: un núcleo que se deforma suavemente, rodeado de un anillo de
//  "ventanas de navegador" flotantes (la idea: sitios web con dimensión).
//  El conjunto se inclina siguiendo el cursor.
//
//  Este archivo NO usa React: solo Three.js. El componente
//  components/Escena3D.js es el que lo conecta con la página.
//
//  Cómo se cuida el rendimiento (todo esto es lo que hace que sea fluida):
//   • Muy pocas "llamadas de dibujo": cada ventana se fusiona en 2 piezas
//     (en vez de ~13), y todas comparten geometrías y materiales.
//   • Los shaders se compilan en segundo plano (compileAsync) para no
//     congelar la página mientras arranca.
//   • Resolución adaptativa: si el equipo no da la talla, baja sola.
//   • Se detiene por completo cuando la portada no se ve.
//   • Sin cálculos de cursor pesados: no se lee el layout en cada movimiento.
// ─────────────────────────────────────────────────────────────────────────

import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// ── Colores de la marca (deben coincidir con app/globals.css) ────────────
const LIMA = "#b6ff3c";
const VIOLETA = "#6d5cff";
const CIAN = "#22d3ee";
const COLORES_VENTANA = [LIMA, VIOLETA, CIAN];

const DISTANCIA_CAMARA = 8;
const RADIO_ANILLO = 3;
const AMPLITUD_DEFORMACION = 0.45;

// ── Contenido de una ventana ─────────────────────────────────────────────
// Dibuja el "sitio web" dentro de la ventana (barra, bloque de color, líneas
// de texto…) como UNA sola pieza con colores por vértice. Así el contenido
// entero cuesta una llamada de dibujo, en lugar de una por cada rectángulo.
function construirContenido(acento) {
  const posiciones = [];
  const colores = [];
  const paleta = {
    barra: new Color("#232538"),
    linea: new Color("#3a3d55"),
    acento: new Color(acento),
  };
  const z = 0.045; // apenas por delante de la cara frontal de la ventana (que está en 0.04)

  const agregarColor = (c, veces) => {
    for (let i = 0; i < veces; i++) colores.push(c.r, c.g, c.b);
  };

  // Rectángulo centrado en (x, y): dos triángulos.
  const rectangulo = (x, y, ancho, alto, zz, color) => {
    const x0 = x - ancho / 2, x1 = x + ancho / 2;
    const y0 = y - alto / 2, y1 = y + alto / 2;
    posiciones.push(x0, y0, zz, x1, y0, zz, x1, y1, zz, x0, y0, zz, x1, y1, zz, x0, y1, zz);
    agregarColor(color, 6);
  };

  // Círculo: abanico de triángulos.
  const circulo = (x, y, diametro, zz, color, lados = 16) => {
    const r = diametro / 2;
    for (let i = 0; i < lados; i++) {
      const a0 = (i / lados) * Math.PI * 2;
      const a1 = ((i + 1) / lados) * Math.PI * 2;
      posiciones.push(x, y, zz, x + Math.cos(a0) * r, y + Math.sin(a0) * r, zz, x + Math.cos(a1) * r, y + Math.sin(a1) * r, zz);
      agregarColor(color, 3);
    }
  };

  // Barra superior + 3 puntos
  rectangulo(0, 0.5, 1.78, 0.2, z, paleta.barra);
  circulo(-0.78, 0.5, 0.07, z + 0.005, paleta.acento);
  circulo(-0.68, 0.5, 0.07, z + 0.005, paleta.linea);
  circulo(-0.58, 0.5, 0.07, z + 0.005, paleta.linea);
  // Bloque principal, del color de acento
  rectangulo(-0.35, 0.15, 1.0, 0.42, z, paleta.acento);
  // Líneas de "texto"
  rectangulo(-0.35, -0.2, 1.0, 0.06, z, paleta.linea);
  rectangulo(-0.45, -0.32, 0.8, 0.06, z, paleta.linea);
  // Tarjeta lateral
  rectangulo(0.62, 0.05, 0.5, 0.78, z, paleta.barra);
  circulo(0.62, 0.25, 0.2, z + 0.005, paleta.acento);
  // Fila inferior
  rectangulo(-0.6, -0.5, 0.5, 0.18, z, paleta.barra);
  rectangulo(0, -0.5, 0.5, 0.18, z, paleta.barra);
  rectangulo(0.6, -0.5, 0.5, 0.18, z, paleta.barra);

  const geometria = new BufferGeometry();
  geometria.setAttribute("position", new Float32BufferAttribute(posiciones, 3));
  geometria.setAttribute("color", new Float32BufferAttribute(colores, 3));
  return geometria;
}

// ── Material del núcleo con deformación ──────────────────────────────────
// Es un material estándar de Three.js al que le añadimos una pequeña
// "onda" en el vertex shader, para que la esfera se deforme como una gota.
// También inclinamos las normales según la onda, para que la luz siga la
// deformación y se vea orgánica en vez de plana.
function aplicarDeformacion(material, uniformes) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTiempo = uniformes.uTiempo;
    shader.uniforms.uDeformacion = uniformes.uDeformacion;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uTiempo;
        uniform float uDeformacion;
        // Onda suave que depende de la posición y del tiempo (entre -1 y 1)
        float onda(vec3 p) {
          return (sin(p.x * 1.9 + uTiempo * 1.2) + sin(p.y * 2.3 + uTiempo * 0.9) + sin(p.z * 2.1 + uTiempo * 1.1)) / 3.0;
        }
        // Hacia dónde cambia la onda (su gradiente): sirve para inclinar las normales
        vec3 ondaGradiente(vec3 p) {
          return vec3(
            1.9 * cos(p.x * 1.9 + uTiempo * 1.2),
            2.3 * cos(p.y * 2.3 + uTiempo * 0.9),
            2.1 * cos(p.z * 2.1 + uTiempo * 1.1)
          ) / 3.0;
        }`
      )
      .replace(
        "#include <beginnormal_vertex>",
        `#include <beginnormal_vertex>
        {
          vec3 n0 = normalize(normal);
          vec3 g = ondaGradiente(position);
          g -= n0 * dot(g, n0); // solo la parte que "resbala" por la superficie
          objectNormal = normalize(n0 - g * uDeformacion * ${AMPLITUD_DEFORMACION.toFixed(2)});
        }`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        transformed += normalize(normal) * onda(position) * uDeformacion * ${AMPLITUD_DEFORMACION.toFixed(2)};`
      );
  };
}

// ─────────────────────────────────────────────────────────────────────────
//  crearEscena(host, opciones)
//    host      Elemento HTML donde se inserta el <canvas>.
//    calidad   "alta" | "baja" (equipos modestos: menos objetos y menos resolución).
//    animar    false = una sola imagen fija (accesibilidad: "reducir movimiento").
//    visible   false = arranca detenida (la portada no está en pantalla).
//  Devuelve una promesa con { setVisible(bool), destruir() }.
//  Lanza un error si el navegador no soporta WebGL (el llamador muestra un respaldo).
// ─────────────────────────────────────────────────────────────────────────
export async function crearEscena(host, { calidad, animar, visible }) {
  // El arranque (crear el contexto WebGL, armar la escena, compilar shaders) se
  // reparte en varias tareas cortas. Entre una y otra "cedemos" el control al
  // navegador para que pueda atender scroll, clics o pintar, en vez de quedarse
  // congelado un instante largo.
  const ceder = () => new Promise((resolver) => setTimeout(resolver, 0));

  const alta = calidad === "alta";
  const ratioNativo = window.devicePixelRatio || 1;
  // Resolución de dibujo. En pantallas de alta densidad no hace falta dibujar
  // cada píxel físico: limitarla ahorra muchísima GPU sin que se note.
  let ratio = Math.min(ratioNativo, alta ? 1.75 : 1.25);
  const RATIO_MINIMO = 0.75;

  // El canvas se crea aquí (no en React) para que cada escena tenga el suyo
  // y al destruirla no queden contextos WebGL a medias.
  const canvas = document.createElement("canvas");
  canvas.className = "escena__canvas";
  host.appendChild(canvas);

  let renderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: alta,
      alpha: true, // fondo transparente: se ve el degradado de la página detrás
      // Escena liviana: en portátiles con dos GPU dejamos que use la integrada.
      // Forzar la dedicada ("high-performance") gasta batería y puede causar un
      // tirón de un segundo al "despertarla".
      powerPreference: "default",
    });
  } catch (error) {
    canvas.remove();
    throw error;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  await ceder();

  const escena = new Scene();
  const camara = new PerspectiveCamera(45, 1, 0.1, 100);
  camara.position.set(0, 0, DISTANCIA_CAMARA);

  // Todo lo que se crea se anota aquí para poder liberarlo al destruir la escena.
  const desechables = [];
  const registrar = (objeto) => {
    desechables.push(objeto);
    return objeto;
  };

  // ── Luces ──────────────────────────────────────────────────────────────
  escena.add(new AmbientLight(0xffffff, 0.7));
  const sol = new DirectionalLight(0xffffff, 2.4);
  sol.position.set(4, 5, 6);
  escena.add(sol);
  const luzVioleta = new PointLight(VIOLETA, 60);
  luzVioleta.position.set(-5, -2, 4);
  escena.add(luzVioleta);
  const luzLima = new PointLight(LIMA, 25);
  luzLima.position.set(5, 3, -3);
  escena.add(luzLima);

  // ── Estructura ─────────────────────────────────────────────────────────
  // conjunto (posición/escala según pantalla)
  //   └ inclinacion (sigue el cursor)
  //       ├ nucleo (esfera + malla de alambre)
  //       └ anillo (gira solo) → ventanas
  const conjunto = new Group();
  const inclinacion = new Group();
  const nucleo = new Group();
  const anillo = new Group();
  anillo.rotation.x = 0.22;
  conjunto.add(inclinacion);
  inclinacion.add(nucleo, anillo);
  escena.add(conjunto);

  // ── Núcleo ─────────────────────────────────────────────────────────────
  const uniformes = {
    uTiempo: { value: 0 },
    uDeformacion: { value: animar ? 0.38 : 0.2 },
  };
  const materialNucleo = registrar(
    new MeshStandardMaterial({
      color: VIOLETA,
      emissive: "#2a1f8a",
      emissiveIntensity: 0.7,
      roughness: 0.25,
      metalness: 0.35,
    })
  );
  aplicarDeformacion(materialNucleo, uniformes);
  const geometriaNucleo = registrar(new IcosahedronGeometry(1.05, alta ? 5 : 3));
  nucleo.add(new Mesh(geometriaNucleo, materialNucleo));

  const geometriaMalla = registrar(new IcosahedronGeometry(1.05, 1));
  const materialMalla = registrar(
    new MeshBasicMaterial({ color: LIMA, wireframe: true, transparent: true, opacity: 0.4, toneMapped: false })
  );
  const malla = new Mesh(geometriaMalla, materialMalla);
  malla.scale.setScalar(1.42);
  nucleo.add(malla);

  // ── Ventanas ───────────────────────────────────────────────────────────
  const geometriaCuerpo = registrar(new RoundedBoxGeometry(1.9, 1.25, 0.08, 2, 0.06));
  const materialCuerpo = registrar(new MeshStandardMaterial({ color: "#14151f", roughness: 0.55, metalness: 0.25 }));
  // toneMapped:false = colores vivos, sin que el mapeo de tonos los apague.
  const materialContenido = registrar(new MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
  const contenidos = COLORES_VENTANA.map((color) => registrar(construirContenido(color)));

  const cantidad = alta ? 6 : 4;
  const ventanas = []; // grupos que "flotan" (suben y bajan suavemente)
  for (let i = 0; i < cantidad; i++) {
    const angulo = (i / cantidad) * Math.PI * 2;
    // Grupo fijo en el anillo, mirando hacia afuera…
    const enAnillo = new Group();
    enAnillo.position.set(Math.sin(angulo) * RADIO_ANILLO, i % 2 === 0 ? 0.45 : -0.45, Math.cos(angulo) * RADIO_ANILLO);
    enAnillo.rotation.y = angulo;
    // …y dentro, el grupo que flota sobre su propio centro.
    const flota = new Group();
    flota.add(new Mesh(geometriaCuerpo, materialCuerpo), new Mesh(contenidos[i % COLORES_VENTANA.length], materialContenido));
    enAnillo.add(flota);
    anillo.add(enAnillo);
    ventanas.push(flota);
  }

  // ── Partículas (solo en calidad alta) ──────────────────────────────────
  let particulas = null;
  if (alta) {
    const cantidadParticulas = 70;
    const datos = new Float32Array(cantidadParticulas * 3);
    for (let i = 0; i < cantidadParticulas; i++) {
      datos[i * 3] = (Math.random() - 0.5) * 14;
      datos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      datos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const geometriaParticulas = registrar(new BufferGeometry());
    geometriaParticulas.setAttribute("position", new Float32BufferAttribute(datos, 3));
    const materialParticulas = registrar(
      new PointsMaterial({
        color: LIMA,
        size: 2.2, // en píxeles (sizeAttenuation apagado)
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      })
    );
    particulas = new Points(geometriaParticulas, materialParticulas);
    escena.add(particulas);
  }

  // ── Tamaño y colocación según la pantalla ──────────────────────────────
  function aplicarTamano() {
    renderer.setPixelRatio(ratio);
    renderer.setSize(canvas.clientWidth || 1, canvas.clientHeight || 1, false); // false: el tamaño visible lo manda el CSS
  }

  function ubicar() {
    const ancho = canvas.clientWidth || 1;
    const alto = canvas.clientHeight || 1;
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();

    const mitadAlto = Math.tan(MathUtils.degToRad(camara.fov / 2)) * DISTANCIA_CAMARA;
    const mitadAncho = mitadAlto * camara.aspect;
    const estrecho = ancho < 820; // celular / ventana angosta

    // Escritorio: la escena va a la derecha (el texto ocupa la izquierda).
    // Celular: la escena va arriba y centrada (el texto queda abajo).
    const x = estrecho ? 0 : mitadAncho * 0.42;
    const y = estrecho ? mitadAlto * 0.32 : 0;
    // Escala para que el anillo completo quepa en el espacio disponible.
    // (4.3 = radio del anillo + medio ancho de una ventana + margen por la perspectiva)
    const disponible = estrecho ? mitadAncho : mitadAncho - x;
    conjunto.position.set(x, y, 0);
    conjunto.scale.setScalar(Math.min(1, disponible / 4.3));
  }

  // ── Animación ──────────────────────────────────────────────────────────
  const puntero = { x: 0, y: 0 }; // cursor normalizado, entre -1 y 1
  let tiempo = 0;

  function actualizar(dt) {
    tiempo += dt;
    uniformes.uTiempo.value = tiempo;

    anillo.rotation.y += dt * 0.14;
    malla.rotation.y += dt * 0.25;
    malla.rotation.x += dt * 0.1;
    nucleo.position.y = Math.sin(tiempo * 1.4) * 0.12;

    for (let i = 0; i < ventanas.length; i++) {
      const f = ventanas[i];
      f.position.y = Math.sin(tiempo * 1.1 + i * 1.7) * 0.09;
      f.rotation.x = Math.sin(tiempo * 0.8 + i) * 0.05;
      f.rotation.z = Math.cos(tiempo * 0.7 + i * 2.1) * 0.03;
    }

    if (particulas) {
      particulas.rotation.y = tiempo * 0.02;
      particulas.position.y = Math.sin(tiempo * 0.3) * 0.15;
    }

    // La escena se inclina con suavidad hacia donde apunta el cursor.
    inclinacion.rotation.y = MathUtils.damp(inclinacion.rotation.y, puntero.x * 0.35, 3, dt);
    inclinacion.rotation.x = MathUtils.damp(inclinacion.rotation.x, -puntero.y * 0.2, 3, dt);
  }

  function dibujar() {
    renderer.render(escena, camara);
  }

  // Resolución adaptativa: si más de 60% de los últimos 60 cuadros tardaron
  // más de ~26 ms (menos de ~38 fps), bajamos la resolución un escalón.
  // Solo baja, nunca sube: así no hay vaivenes de calidad visibles.
  let descarte = 0;
  let muestras = 0;
  let lentos = 0;
  function vigilarRendimiento(dtReal) {
    if (descarte > 0) {
      descarte--; // los primeros cuadros tras arrancar no cuentan (calentamiento)
      return;
    }
    if (dtReal > 0.1) return; // una pausa larga (pestaña oculta) no es lentitud de la escena
    muestras++;
    if (dtReal > 0.026) lentos++;
    if (muestras >= 60) {
      if (lentos > 36 && ratio > RATIO_MINIMO) {
        ratio = Math.max(RATIO_MINIMO, ratio - 0.25);
        aplicarTamano();
      }
      muestras = 0;
      lentos = 0;
    }
  }

  let corriendo = false;
  let raf = 0;
  let ultimo = 0;

  // Límite de ~60 cuadros por segundo. En pantallas de 120/144 Hz, dibujar en
  // cada refresco gasta el doble de GPU y batería sin que se note la diferencia.
  //
  // Cómo funciona: seguimos midiendo cada cuánto refresca la pantalla (mediana de
  // los últimos 30 intervalos). Un refresco solo se dibuja si ya pasó casi el
  // tiempo objetivo desde el último dibujo. Resultado: 60 Hz → todos; 120 Hz →
  // la mitad (60); 144 Hz → uno de cada dos (72); 240 Hz → uno de cada cuatro.
  // Si la escena va lenta, el intervalo medido ya es largo y no se salta nada.
  // Se decide por TIEMPO y no contando refrescos: así un cuadro algo lento no
  // provoca que se pierda uno extra.
  const OBJETIVO = 1 / 60;
  let refresco = OBJETIVO; // estimación de cada cuánto refresca la pantalla
  let acumulado = 0; // tiempo real transcurrido desde el último cuadro que sí se dibujó
  const intervalos = [];

  function medirRefresco(dtReal) {
    if (dtReal > 0.1) return; // una pausa larga (pestaña oculta) no cuenta
    intervalos.push(dtReal);
    if (intervalos.length >= 30) {
      intervalos.sort((a, b) => a - b);
      refresco = intervalos[15];
      intervalos.length = 0;
    }
  }

  function cuadro(ahora) {
    raf = requestAnimationFrame(cuadro);
    const dtReal = (ahora - ultimo) / 1000;
    ultimo = ahora;
    medirRefresco(dtReal);

    acumulado += dtReal;
    if (acumulado < OBJETIVO - refresco * 0.6) return; // todavía no toca dibujar
    const dt = acumulado;
    acumulado = 0;

    actualizar(Math.min(dt, 0.05)); // tope: tras una pausa larga la animación no da un salto
    dibujar();
    vigilarRendimiento(dt);
  }

  function alMoverPuntero(evento) {
    if (evento.pointerType === "touch") return; // en táctil no hay "cursor"
    // Se usan las dimensiones de la ventana (no del canvas) para no forzar
    // cálculos de layout en cada movimiento del mouse.
    puntero.x = (evento.clientX / window.innerWidth) * 2 - 1;
    puntero.y = -((evento.clientY / window.innerHeight) * 2 - 1);
  }

  function iniciar() {
    if (corriendo) return;
    corriendo = true;
    ultimo = performance.now();
    acumulado = 0;
    descarte = 45;
    muestras = 0;
    lentos = 0;
    window.addEventListener("pointermove", alMoverPuntero, { passive: true });
    raf = requestAnimationFrame(cuadro);
  }

  function detener() {
    corriendo = false;
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", alMoverPuntero);
  }

  // Si cambia el tamaño de la ventana, se reajusta (y en modo estático se redibuja).
  const observador = new ResizeObserver(() => {
    aplicarTamano();
    ubicar();
    if (!corriendo) dibujar();
  });

  aplicarTamano();
  ubicar();
  actualizar(0);
  await ceder();

  // Compilar los shaders en segundo plano evita el "tirón" al arrancar. Solo se
  // pide si el navegador lo soporta; si no, se compilan en el primer dibujo.
  if (renderer.getContext().getExtension("KHR_parallel_shader_compile")) {
    try {
      await renderer.compileAsync(escena, camara);
    } catch {
      /* si falla, se compilarán en el primer dibujo */
    }
  }

  dibujar(); // primer cuadro (también sirve como imagen fija si no se anima)
  observador.observe(canvas);

  let destruida = false;
  const controlador = {
    setVisible(valor) {
      if (destruida) return;
      if (valor && animar) iniciar();
      else if (valor) dibujar();
      else detener();
    },
    destruir() {
      if (destruida) return;
      destruida = true;
      detener();
      observador.disconnect();
      desechables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.forceContextLoss(); // libera el contexto WebGL de inmediato
      canvas.remove();
    },
  };

  controlador.setVisible(visible);
  return controlador;
}
