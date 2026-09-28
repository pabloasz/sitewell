// ─────────────────────────────────────────────────────────────────────────
//  ESCENA 3D DE "FORJA — CLUB DE FUERZA" (Three.js "a pelo", igual que la
//  portada de Sitewell: sin React Three Fiber, para que el 3D pese lo menos
//  posible).
//
//  Composición: una barra de pesas (con discos y un brillo de "brasa" en la
//  punta) que gira sobre su propio eje, rodeada de un anillo de discos de
//  pesas más pequeños que flotan (los colores rojo/azul/amarillo imitan el
//  código de colores real de los discos de powerlifting). El conjunto se
//  inclina siguiendo el cursor, igual que en la portada.
//
//  Este archivo reutiliza EXACTAMENTE la misma estrategia de rendimiento que
//  lib/crearEscena.js (la escena de la portada). Si algo de esto no queda
//  claro, ese archivo tiene los comentarios largos explicando el porqué;
//  aquí solo se repite lo esencial para no duplicar el texto.
// ─────────────────────────────────────────────────────────────────────────

import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BufferGeometry,
  CylinderGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from "three";

// ── Colores de la marca (deben coincidir con app/forja-gym/forja.css) ────
const ACERO = "#c7ccd6"; // barra y herrajes metálicos
const CARBON = "#141414"; // cuerpo de los discos (caucho)
const BRASA = "#ff5a1f"; // brillo de "forja" en la punta de la barra
const COLORES_DISCO = ["#e8432c", "#2f6fed", "#ffc93c"]; // rojo / azul / amarillo: código real de pesos

const DISTANCIA_CAMARA = 8;
const RADIO_ANILLO = 3.2;

// ─────────────────────────────────────────────────────────────────────────
//  crearEscena(host, opciones) — misma firma y mismo contrato que la de la
//  portada: devuelve una promesa con { setVisible(bool), destruir() } y
//  lanza un error si no hay WebGL (el llamador muestra un respaldo).
// ─────────────────────────────────────────────────────────────────────────
export async function crearEscena(host, { calidad, animar, visible }) {
  const ceder = () => new Promise((resolver) => setTimeout(resolver, 0));

  const alta = calidad === "alta";
  const ratioNativo = window.devicePixelRatio || 1;
  let ratio = Math.min(ratioNativo, alta ? 1.75 : 1.25);
  const RATIO_MINIMO = 0.75;

  const canvas = document.createElement("canvas");
  canvas.className = "fj-escena__canvas";
  host.appendChild(canvas);

  let renderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: alta,
      alpha: true,
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

  const desechables = [];
  const registrar = (objeto) => {
    desechables.push(objeto);
    return objeto;
  };

  // ── Luces ──────────────────────────────────────────────────────────────
  // Una luz cálida (brasa) y una fría (acero) para que el metal tenga contraste.
  escena.add(new AmbientLight(0xffffff, 0.55));
  const sol = new DirectionalLight(0xffffff, 2.2);
  sol.position.set(4, 5, 6);
  escena.add(sol);
  const luzBrasa = new PointLight(BRASA, 55);
  luzBrasa.position.set(-4, -1, 4);
  escena.add(luzBrasa);
  const luzAcero = new PointLight("#8fb8ff", 20);
  luzAcero.position.set(5, 3, -3);
  escena.add(luzAcero);

  // ── Estructura ─────────────────────────────────────────────────────────
  // conjunto (posición/escala según pantalla)
  //   └ inclinacion (sigue el cursor)
  //       ├ barra (gira sobre su propio eje)
  //       └ anillo (gira solo) → discos flotantes
  const conjunto = new Group();
  const inclinacion = new Group();
  const barra = new Group();
  const anillo = new Group();
  anillo.rotation.x = 0.2;
  conjunto.add(inclinacion);
  inclinacion.add(barra, anillo);
  escena.add(conjunto);

  // ── Materiales compartidos ────────────────────────────────────────────
  const materialAcero = registrar(new MeshStandardMaterial({ color: ACERO, metalness: 0.85, roughness: 0.25 }));
  const materialDisco = registrar(new MeshStandardMaterial({ color: CARBON, metalness: 0.15, roughness: 0.65 }));
  const materialBrasa = registrar(
    new MeshStandardMaterial({ color: BRASA, emissive: BRASA, emissiveIntensity: 1.1, metalness: 0.2, roughness: 0.35 })
  );

  // ── La barra (el "núcleo" de la escena) ──────────────────────────────
  // Todas las geometrías nacen orientadas en Y; rotateZ(90°) las acuesta
  // sobre el eje X, que es el largo de la barra.
  const MEDIA_BARRA = 1.7;
  const geometriaBarra = registrar(new CylinderGeometry(0.09, 0.09, MEDIA_BARRA * 2, 12).rotateZ(Math.PI / 2));
  barra.add(new Mesh(geometriaBarra, materialAcero));

  const geometriaDisco = registrar(new CylinderGeometry(0.95, 0.95, 0.26, 24).rotateZ(Math.PI / 2));
  const geometriaBrasa = registrar(new CylinderGeometry(0.42, 0.42, 0.3, 20).rotateZ(Math.PI / 2));
  const geometriaCollar = registrar(new TorusGeometry(0.14, 0.035, 8, 16).rotateY(Math.PI / 2));
  const geometriaAgarre = registrar(new TorusGeometry(0.13, 0.02, 6, 20).rotateY(Math.PI / 2));

  barra.add(new Mesh(geometriaAgarre, materialAcero)); // brillo en el agarre central

  for (const lado of [-1, 1]) {
    const collar = new Mesh(geometriaCollar, materialAcero);
    collar.position.x = lado * 1.5;
    const disco = new Mesh(geometriaDisco, materialDisco);
    disco.position.x = lado * 1.72;
    const brasa = new Mesh(geometriaBrasa, materialBrasa);
    brasa.position.x = lado * 1.9;
    barra.add(collar, disco, brasa);
  }

  // ── Anillo de discos flotantes ───────────────────────────────────────
  // rotateX(90°) hace que la cara plana del disco mire hacia +Z local; al
  // colocarlo en el anillo con rotation.y = ángulo, esa cara queda mirando
  // hacia afuera (mismo truco que las "ventanas" de la escena de la portada).
  const geometriaDiscoAnillo = registrar(new CylinderGeometry(0.52, 0.52, 0.16, 20).rotateX(Math.PI / 2));
  const geometriaAroAnillo = registrar(new TorusGeometry(0.52, 0.045, 8, 22));
  const materialesAro = COLORES_DISCO.map((color) =>
    registrar(new MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.35, metalness: 0.3, roughness: 0.4 }))
  );

  const cantidad = alta ? 6 : 4;
  const discos = []; // grupos que "flotan" (suben y bajan suavemente)
  for (let i = 0; i < cantidad; i++) {
    const angulo = (i / cantidad) * Math.PI * 2;
    const enAnillo = new Group();
    enAnillo.position.set(Math.sin(angulo) * RADIO_ANILLO, i % 2 === 0 ? 0.4 : -0.4, Math.cos(angulo) * RADIO_ANILLO);
    enAnillo.rotation.y = angulo;
    const flota = new Group();
    const aro = new Mesh(geometriaAroAnillo, materialesAro[i % materialesAro.length]);
    aro.position.z = 0.09;
    flota.add(new Mesh(geometriaDiscoAnillo, materialDisco), aro);
    enAnillo.add(flota);
    anillo.add(enAnillo);
    discos.push(flota);
  }

  // ── Partículas: chispas de forja (solo en calidad alta) ──────────────
  let particulas = null;
  if (alta) {
    const cantidadParticulas = 90;
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
        color: BRASA,
        size: 2.4,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.65,
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
    renderer.setSize(canvas.clientWidth || 1, canvas.clientHeight || 1, false);
  }

  function ubicar() {
    const ancho = canvas.clientWidth || 1;
    const alto = canvas.clientHeight || 1;
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();

    const mitadAlto = Math.tan(MathUtils.degToRad(camara.fov / 2)) * DISTANCIA_CAMARA;
    const mitadAncho = mitadAlto * camara.aspect;
    const estrecho = ancho < 820;

    const x = estrecho ? 0 : mitadAncho * 0.42;
    const y = estrecho ? mitadAlto * 0.32 : 0;
    const disponible = estrecho ? mitadAncho : mitadAncho - x;
    conjunto.position.set(x, y, 0);
    conjunto.scale.setScalar(Math.min(1, disponible / 4.3));
  }

  // ── Animación ──────────────────────────────────────────────────────────
  const puntero = { x: 0, y: 0 };
  let tiempo = 0;

  function actualizar(dt) {
    tiempo += dt;

    barra.rotation.x += dt * (animar ? 0.5 : 0);
    barra.position.y = Math.sin(tiempo * 1.3) * 0.14;

    anillo.rotation.y += dt * 0.16;
    for (let i = 0; i < discos.length; i++) {
      const f = discos[i];
      f.position.y = Math.sin(tiempo * 1.1 + i * 1.7) * 0.09;
      f.rotation.x = Math.sin(tiempo * 0.8 + i) * 0.05;
      f.rotation.z = Math.cos(tiempo * 0.7 + i * 2.1) * 0.03;
    }

    if (particulas) {
      particulas.rotation.y = tiempo * 0.02;
      particulas.position.y = Math.sin(tiempo * 0.3) * 0.15;
    }

    inclinacion.rotation.y = MathUtils.damp(inclinacion.rotation.y, puntero.x * 0.35, 3, dt);
    inclinacion.rotation.x = MathUtils.damp(inclinacion.rotation.x, -puntero.y * 0.2, 3, dt);
  }

  function dibujar() {
    renderer.render(escena, camara);
  }

  // Resolución adaptativa (ver lib/crearEscena.js para la explicación completa).
  let descarte = 0;
  let muestras = 0;
  let lentos = 0;
  function vigilarRendimiento(dtReal) {
    if (descarte > 0) {
      descarte--;
      return;
    }
    if (dtReal > 0.1) return;
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

  // Límite de ~60 cuadros por segundo (ver lib/crearEscena.js para la explicación completa).
  const OBJETIVO = 1 / 60;
  let refresco = OBJETIVO;
  let acumulado = 0;
  const intervalos = [];

  function medirRefresco(dtReal) {
    if (dtReal > 0.1) return;
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
    if (acumulado < OBJETIVO - refresco * 0.6) return;
    const dt = acumulado;
    acumulado = 0;

    actualizar(Math.min(dt, 0.05));
    dibujar();
    vigilarRendimiento(dt);
  }

  function alMoverPuntero(evento) {
    if (evento.pointerType === "touch") return;
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

  const observador = new ResizeObserver(() => {
    aplicarTamano();
    ubicar();
    if (!corriendo) dibujar();
  });

  aplicarTamano();
  ubicar();
  actualizar(0);
  await ceder();

  if (renderer.getContext().getExtension("KHR_parallel_shader_compile")) {
    try {
      await renderer.compileAsync(escena, camara);
    } catch {
      /* si falla, se compilarán en el primer dibujo */
    }
  }

  dibujar();
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
      renderer.forceContextLoss();
      canvas.remove();
    },
  };

  controlador.setVisible(visible);
  return controlador;
}
