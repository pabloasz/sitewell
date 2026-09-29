/*
 * lib/crearEscenaHotel.js
 * Escena 3D del proyecto concepto "Hotel Meridiano", en Three.js puro (sin React, sin
 * React Three Fiber ni drei), igual que lib/crearEscena.js.
 *
 * A diferencia de la escena de Sitewell (un núcleo abstracto que se deforma), aquí se arma
 * una maqueta del hotel con piezas 3D reales (no geometría dibujada a mano): el edificio se
 * construye combinando piezas del "Building Kit" de Kenney (paredes, ventana, puerta, techo,
 * columnas) y el acantilado con bloques del "Nature Kit" de Kenney — ambos CC0 (dominio
 * público), descargados a public/modelos/. El mar, la piscina y las partículas sí siguen
 * siendo geometría simple (planos), no hacía falta un modelo para eso.
 *
 * La cámara no se mueve: lo que se mueve es la maqueta, acercándose y "aterrizando" a medida
 * que se hace scroll en el hero (ver `elementoPista` más abajo). Así reutiliza toda la lógica
 * de cámara fija que ya existía.
 *
 * Uso:  const escena = await crearEscenaHotel(elemento, { calidad, animar, visible, senal, elementoPista });
 *       escena.setVisible(false);  // pausa cuando la portada no se ve
 *       escena.destruir();         // libera todo
 *
 * REGLA (igual que en lib/crearEscena.js): cualquier cambio debe conservar las ramas de
 * degradación: calidad baja, movimiento reducido (animar: false -> sin scroll-scrubbing,
 * una sola pose fija), pausa fuera de pantalla, error sin WebGL (o si no cargan los modelos)
 * y destrucción limpia.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  Box3,
  BufferGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ---------------------------------------------------------------------------
// Colores. DORADO y AGUA DEBEN coincidir con --accent y --cyan de .hotel en app/globals.css.
// (El edificio y el acantilado ya no usan estos colores: traen su propia textura/material
// desde los modelos de Kenney. Solo el mar, la piscina y las partículas los siguen usando.)
// ---------------------------------------------------------------------------
const DORADO = "#e3b56c"; // partículas y brillo de la piscina
const AGUA = "#7fb8ad"; // mar y piscina

// Piezas 3D (CC0, Kenney, ver public/modelos/) que arman la maqueta.
const RUTA_MODELOS = "/modelos";
const ALTO_PARED = 2.4; // medido: altura de wall.glb (todas las paredes miden lo mismo)

// ---------------------------------------------------------------------------
// Medidas de la escena
// ---------------------------------------------------------------------------
const CAMPO_VISION = 38;
const DISTANCIA_CAMARA = 10;
const RADIO_ESCENA = 2.1; // radio "seguro" de la maqueta (con margen: al acercarse crece más de lo que mide en reposo)
const ESCALA_MAQUETA = 0.42; // la maqueta real mide ~5 unidades; se achica para que quepa en la escena
const BREAKPOINT_ESCRITORIO = 820; // px; igual que el breakpoint del hero en globals.css

// ---------------------------------------------------------------------------
// El "vuelo": cómo se transforma la maqueta entre el inicio (aérea, lejos) y el final
// (a nivel del hotel, cerca) del recorrido de scroll. Ver calcularProgreso().
// ---------------------------------------------------------------------------
const VUELO_Z = [-1.5, 1.1];
const VUELO_Y = [0.95, 0.6];
const VUELO_ESCALA = [0.78, 1.05];
const VUELO_INCLINACION = [-0.75, -0.12]; // radianes: mirada casi cenital -> casi a nivel

// ---------------------------------------------------------------------------
// Rendimiento (idéntico a lib/crearEscena.js: es la lógica que garantiza que el 3D no degrada)
// ---------------------------------------------------------------------------
const MS_POR_CUADRO = 1000 / 60; // tope de ~60 fps
const DT_MAXIMO = 0.05; // segundos; evita saltos bruscos tras una pausa
const CUADROS_CALENTAMIENTO = 45; // los primeros cuadros no cuentan para el monitoreo
const CUADROS_MONITOREADOS = 60;
const MS_CUADRO_LENTO = 26;
const PROPORCION_LENTOS = 0.6;
const PASO_RESOLUCION = 0.25;
const RESOLUCION_MINIMA = 0.75;

// Cede el hilo al navegador para que la página no se congele mientras se arma la escena.
const ceder = () => new Promise((resolver) => setTimeout(resolver, 0));

// Aleatorio con semilla: las partículas quedan siempre igual entre cargas.
function aleatorioConSemilla(semilla) {
  return () => {
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Interpolación suave (curva en S): progreso lineal 0..1 -> avance más natural.
const suavizar = (t) => t * t * (3 - 2 * t);

// ---------------------------------------------------------------------------
// Función principal
// ---------------------------------------------------------------------------
export async function crearEscenaHotel(
  host,
  { calidad = "alta", animar = true, visible = true, senal, elementoPista = null } = {},
) {
  const alta = calidad === "alta";

  const comprobarCancelacion = () => {
    if (senal?.aborted) throw new DOMException("Escena cancelada", "AbortError");
  };
  comprobarCancelacion();

  // Si el navegador no tiene WebGL, esta línea lanza un error y HeroEscenaHotel muestra el fondo de respaldo.
  const renderer = new WebGLRenderer({
    antialias: alta, // el suavizado de bordes es caro: solo en calidad alta
    alpha: true,
    powerPreference: "default", // a propósito: forzar la GPU dedicada gastaba batería y causaba un tirón inicial
  });

  // Resolución: la del monitor con un tope. En calidad baja el tope es menor.
  let resolucion = Math.min(window.devicePixelRatio || 1, alta ? 1.75 : 1.25);
  renderer.setPixelRatio(resolucion);
  renderer.toneMapping = ACESFilmicToneMapping;
  host.appendChild(renderer.domElement);

  // Todo lo que crea GPU (geometrías, materiales) se registra aquí para liberarlo en destruir().
  const recursos = [];
  const registrar = (recurso) => {
    recursos.push(recurso);
    return recurso;
  };

  let destruida = false;
  let observador = null;
  let idCuadro = 0; // 0 = el ciclo de animación está detenido

  const objetivoPuntero = { x: 0, y: 0 };
  const alMoverPuntero = (evento) => {
    if (evento.pointerType !== "mouse") return; // en táctil no hay "cursor": se ignora
    objetivoPuntero.x = (evento.clientX / window.innerWidth) * 2 - 1;
    objetivoPuntero.y = (evento.clientY / window.innerHeight) * 2 - 1;
  };

  const detener = () => {
    if (idCuadro) cancelAnimationFrame(idCuadro);
    idCuadro = 0;
    window.removeEventListener("pointermove", alMoverPuntero);
  };

  const destruir = () => {
    if (destruida) return;
    destruida = true;
    detener();
    observador?.disconnect();
    recursos.forEach((recurso) => recurso.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };

  // La cámara queda fija (igual que en lib/crearEscena.js): lo que se anima es `vuelo`, más abajo.
  const escena = new Scene();
  const camara = new PerspectiveCamera(CAMPO_VISION, 1, 0.1, 100);
  camara.position.set(0, 0, DISTANCIA_CAMARA);
  const conjunto = new Group(); // colocación responsiva (ubicar()) + inclinación hacia el cursor
  escena.add(conjunto);

  // Cuánto ha avanzado el "vuelo" hacia el hotel: 0 = vista aérea, 1 = a nivel de la entrada.
  // Con movimiento reducido no hay scroll-scrubbing: se congela en una pose fija.
  let progreso = 0;
  const calcularProgreso = () => {
    if (!animar) return 0.4;
    if (!elementoPista) return 0;
    const caja = elementoPista.getBoundingClientRect();
    const recorrido = caja.height - window.innerHeight;
    if (recorrido <= 0) return 0;
    return MathUtils.clamp(-caja.top / recorrido, 0, 1);
  };

  let tiempo = animar ? 0 : 6; // acumulado para el giro lento; congelado en una pose si no hay movimiento

  let vuelo;
  let inclinacionAerea;
  let giro;
  let puntos = null;

  try {
    await ceder();
    comprobarCancelacion();

    // ---- Luces ----
    // La maqueta gira bastante entre la pose aérea y la de nivel: con solo luz direccional se
    // queda a oscuras en algunos ángulos, por eso la ambiental es la que más pesa aquí.
    escena.add(new AmbientLight(0xffffff, 1.3));
    const sol = new DirectionalLight(0xffffff, 1.8);
    sol.position.set(4, 6, 5);
    escena.add(sol);
    const luzDorada = new PointLight(DORADO, 55);
    luzDorada.position.set(-2, 2, 4);
    escena.add(luzDorada);
    const luzAgua = new PointLight(AGUA, 22);
    luzAgua.position.set(3, -1, -2);
    escena.add(luzAgua);

    // ---- Jerarquía del "vuelo" ----
    // conjunto (colocación responsiva + cursor)
    //   └ vuelo (se acerca/aleja y escala según el scroll)
    //       └ inclinacionAerea (pasa de mirada cenital a mirada a nivel según el scroll)
    //           └ giro (gira lento sobre sí misma, solo si hay movimiento)
    //               └ maqueta: mar, acantilado (modelos), edificio (modelos), piscina
    vuelo = new Group();
    conjunto.add(vuelo);
    inclinacionAerea = new Group();
    vuelo.add(inclinacionAerea);
    giro = new Group();
    inclinacionAerea.add(giro);
    const maqueta = new Group();
    // La maqueta mide varias unidades de lado (son modelos a escala real): se achica para
    // que quepa en la escena. Y se recentra en Y para que el eje de inclinacionAerea pase
    // cerca de su centro: si el punto de giro quedara en la base del edificio, el techo
    // describiría un arco enorme al pasar de "cenital" a "a nivel" y se saldría del cuadro.
    maqueta.scale.setScalar(ESCALA_MAQUETA);
    maqueta.position.y = -0.17;
    giro.add(maqueta);

    // ---- Piezas 3D: cargar los modelos de Kenney (CC0) antes de armar la maqueta ----
    // Todas se cargan en paralelo. Si alguna falla (por ejemplo sin conexión), la promesa
    // rechaza y HeroEscenaHotel muestra el fondo de respaldo, igual que si fallara WebGL.
    const cargador = new GLTFLoader();
    const cargarPieza = (ruta) =>
      new Promise((resolver, rechazar) => {
        cargador.load(
          ruta,
          (gltf) => resolver(gltf.scene),
          undefined,
          (error) => rechazar(error instanceof Error ? error : new Error(`No se pudo cargar ${ruta}`)),
        );
      });

    const [
      piezaPared,
      piezaParedVentana,
      piezaParedPuerta,
      piezaTecho,
      piezaPiso,
      piezaColumna,
      piezaRoca,
    ] = await Promise.all([
      cargarPieza(`${RUTA_MODELOS}/building/wall.glb`),
      cargarPieza(`${RUTA_MODELOS}/building/wall-window-wide-square-detailed.glb`),
      cargarPieza(`${RUTA_MODELOS}/building/wall-doorway-square.glb`),
      cargarPieza(`${RUTA_MODELOS}/building/roof-flat-square.glb`),
      cargarPieza(`${RUTA_MODELOS}/building/floor.glb`),
      cargarPieza(`${RUTA_MODELOS}/building/column.glb`),
      cargarPieza(`${RUTA_MODELOS}/nature/cliff_block_rock.glb`),
    ]);
    comprobarCancelacion();

    // Cada pieza original se registra una sola vez (las instancias de abajo son clones que
    // comparten la misma geometría/material: no hay que registrarlas de nuevo).
    [piezaPared, piezaParedVentana, piezaParedPuerta, piezaTecho, piezaPiso, piezaColumna, piezaRoca].forEach(
      (pieza) => {
        pieza.traverse((hijo) => {
          if (hijo.geometry) registrar(hijo.geometry);
          if (hijo.material) registrar(hijo.material);
        });
      },
    );
    const cajaRoca = new Box3().setFromObject(piezaRoca); // para apoyar bloques de roca por su cara de arriba

    // Coloca un clon apoyando su cara de ARRIBA en y = tope (en vez de su base, como las demás piezas).
    const apoyarPorArriba = (pieza, { x, z, escala, tope = 0 }) => {
      const clon = pieza.clone(true);
      clon.scale.setScalar(escala);
      clon.position.set(x, tope - cajaRoca.max.y * escala, z);
      maqueta.add(clon);
      return clon;
    };
    // Coloca un clon apoyado por su base (todas las piezas del edificio ya nacen con base en y=0).
    const colocar = (pieza, { x = 0, y = 0, z = 0, rotacionY = 0 } = {}) => {
      const clon = pieza.clone(true);
      clon.position.set(x, y, z);
      clon.rotation.y = rotacionY;
      maqueta.add(clon);
      return clon;
    };

    // ---- Acantilado: un puñado de bloques de roca irregulares bajo el edificio ----
    [
      { x: -1.3, z: 0, escala: 1.7, tope: 0 },
      { x: 0.4, z: -0.3, escala: 1.9, tope: 0 },
      { x: 1.5, z: 0.2, escala: 1.6, tope: -0.1 },
      { x: 0, z: 1.15, escala: 1.5, tope: -0.2 }, // repisa que asoma hacia el mar, frente a la entrada
      { x: -0.9, z: -1.0, escala: 1.4, tope: -0.08 },
    ].forEach((datos) => apoyarPorArriba(piezaRoca, datos));

    await ceder();
    comprobarCancelacion();

    // ---- Mar: bien por debajo del acantilado, para que se lea como una isla saliendo del agua ----
    const mar = new Mesh(
      registrar(new PlaneGeometry(12, 12)),
      registrar(new MeshStandardMaterial({ color: AGUA, roughness: 0.35, metalness: 0.1 })),
    );
    mar.rotation.x = -Math.PI / 2;
    mar.position.y = -2.1;
    maqueta.add(mar);

    // ---- Edificio: 2 celdas de largo (x) x 1 celda de fondo (z), armado con paredes reales ----
    // Frente (hacia +z, mira a la cámara): la pared ancha con ventana, de las dos caras la más vistosa.
    colocar(piezaParedVentana, { z: 1, rotacionY: Math.PI / 2 });
    // Fondo (hacia -z): dos paredes lisas, una junto a otra.
    colocar(piezaPared, { x: -1, z: -1, rotacionY: Math.PI / 2 });
    colocar(piezaPared, { x: 1, z: -1, rotacionY: Math.PI / 2 });
    // Costado izquierdo: la entrada.
    colocar(piezaParedPuerta, { x: -2, z: 0 });
    // Costado derecho: pared lisa.
    colocar(piezaPared, { x: 2, z: 0 });
    // Piso: dos baldosas.
    colocar(piezaPiso, { x: -1, z: 0 });
    colocar(piezaPiso, { x: 1, z: 0 });
    // Techo plano: dos módulos, apoyados sobre el alto de las paredes.
    colocar(piezaTecho, { x: -1, y: ALTO_PARED, z: 0 });
    colocar(piezaTecho, { x: 1, y: ALTO_PARED, z: 0 });
    // Un par de columnas flanqueando la entrada.
    colocar(piezaColumna, { x: -2.3, z: -0.65 });
    colocar(piezaColumna, { x: -2.3, z: 0.65 });

    await ceder();
    comprobarCancelacion();

    // ---- Piscina, sobre la repisa de roca que asoma hacia el mar ----
    const piscina = new Mesh(
      registrar(new PlaneGeometry(1.1, 0.7)),
      registrar(new MeshStandardMaterial({ color: AGUA, roughness: 0.2, emissive: AGUA, emissiveIntensity: 0.2 })),
    );
    piscina.rotation.x = -Math.PI / 2;
    piscina.position.set(0, -0.19, 1.5); // sobre la repisa de roca (x=0, z=1.15, tope=-0.2), más afuera
    maqueta.add(piscina);

    await ceder();
    comprobarCancelacion();

    // ---- Partículas: brasas suspendidas alrededor de la maqueta (solo calidad alta) ----
    if (alta) {
      const azar = aleatorioConSemilla(20260928);
      const total = 50;
      const posiciones = new Float32Array(total * 3);
      for (let i = 0; i < total; i++) {
        const distancia = 1.8 + azar() * 2.6;
        const cosenoPolar = azar() * 0.8; // mitad superior, sobre la maqueta
        const azimut = azar() * Math.PI * 2;
        const senoPolar = Math.sqrt(1 - cosenoPolar * cosenoPolar);
        posiciones[i * 3] = distancia * senoPolar * Math.cos(azimut);
        posiciones[i * 3 + 1] = distancia * cosenoPolar;
        posiciones[i * 3 + 2] = distancia * senoPolar * Math.sin(azimut);
      }
      const geometriaPuntos = registrar(new BufferGeometry());
      geometriaPuntos.setAttribute("position", new Float32BufferAttribute(posiciones, 3));
      puntos = new Points(
        geometriaPuntos,
        registrar(
          new PointsMaterial({
            color: DORADO,
            size: 2,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0.7,
            blending: AdditiveBlending,
            depthWrite: false,
          }),
        ),
      );
      conjunto.add(puntos);
    }

    // ---- Colocación adaptativa (igual idea que en lib/crearEscena.js) ----
    const ubicar = () => {
      const ancho = Math.max(1, host.clientWidth);
      const alto = Math.max(1, host.clientHeight);
      renderer.setSize(ancho, alto, false);
      camara.aspect = ancho / alto;
      camara.updateProjectionMatrix();

      const mitadAlto = Math.tan(MathUtils.degToRad(CAMPO_VISION / 2)) * DISTANCIA_CAMARA;
      const mitadAncho = mitadAlto * camara.aspect;

      let disponible;
      if (ancho >= BREAKPOINT_ESCRITORIO) {
        conjunto.position.set(mitadAncho * 0.42, 0, 0);
        disponible = Math.min(mitadAncho * 0.58, mitadAlto);
      } else {
        conjunto.position.set(0, mitadAlto * 0.3, 0);
        disponible = Math.min(mitadAncho, mitadAlto * 0.66);
      }
      conjunto.scale.setScalar(Math.min(1, disponible / RADIO_ESCENA));
    };

    // Aplica el progreso de scroll (vuelo + inclinación) y el giro lento.
    const actualizarObjetos = () => {
      const suave = suavizar(progreso);
      vuelo.position.z = MathUtils.lerp(VUELO_Z[0], VUELO_Z[1], suave);
      vuelo.position.y = MathUtils.lerp(VUELO_Y[0], VUELO_Y[1], suave);
      vuelo.scale.setScalar(MathUtils.lerp(VUELO_ESCALA[0], VUELO_ESCALA[1], suave));
      inclinacionAerea.rotation.x = MathUtils.lerp(VUELO_INCLINACION[0], VUELO_INCLINACION[1], suave);
      giro.rotation.y = tiempo * 0.05;
    };

    const pintar = () => renderer.render(escena, camara);

    ubicar();
    progreso = calcularProgreso();
    actualizarObjetos();

    // compileAsync compila los shaders sin congelar la página. Si el navegador no lo soporta bien,
    // los shaders simplemente se compilan en el primer cuadro.
    try {
      await renderer.compileAsync(escena, camara);
    } catch {
      /* se compilará al dibujar el primer cuadro */
    }
    comprobarCancelacion();

    // ---- Ciclo de animación ----
    let ultimoDibujo = 0;
    let ultimoRaf = 0;
    let intervaloRefresco = MS_POR_CUADRO;
    const medidasRefresco = [];
    let refrescoMedido = false;
    let calentamiento = CUADROS_CALENTAMIENTO;
    const lentos = new Array(CUADROS_MONITOREADOS).fill(0);
    let posicionLentos = 0;
    let cuadrosMonitoreados = 0;

    const vigilarRendimiento = (msDesdeElAnterior) => {
      if (calentamiento > 0) {
        calentamiento--;
        return;
      }
      lentos[posicionLentos] = msDesdeElAnterior > MS_CUADRO_LENTO ? 1 : 0;
      posicionLentos = (posicionLentos + 1) % CUADROS_MONITOREADOS;
      cuadrosMonitoreados = Math.min(cuadrosMonitoreados + 1, CUADROS_MONITOREADOS);
      if (cuadrosMonitoreados < CUADROS_MONITOREADOS || resolucion <= RESOLUCION_MINIMA) return;

      const cantidadLentos = lentos.reduce((suma, valor) => suma + valor, 0);
      if (cantidadLentos / CUADROS_MONITOREADOS > PROPORCION_LENTOS) {
        resolucion = Math.max(RESOLUCION_MINIMA, resolucion - PASO_RESOLUCION);
        renderer.setPixelRatio(resolucion);
        lentos.fill(0);
        cuadrosMonitoreados = 0;
        calentamiento = 15;
      }
    };

    const ciclo = (ahora) => {
      idCuadro = requestAnimationFrame(ciclo);

      if (!refrescoMedido) {
        if (ultimoRaf) {
          medidasRefresco.push(ahora - ultimoRaf);
          if (medidasRefresco.length >= 30) {
            medidasRefresco.sort((a, b) => a - b);
            intervaloRefresco = MathUtils.clamp(medidasRefresco[15], 4, 34);
            refrescoMedido = true;
          }
        }
        ultimoRaf = ahora;
      }

      const transcurrido = ahora - ultimoDibujo;
      if (ultimoDibujo && transcurrido < MS_POR_CUADRO - intervaloRefresco / 2) return;

      const dt = ultimoDibujo ? Math.min(transcurrido / 1000, DT_MAXIMO) : 1 / 60;
      ultimoDibujo = ahora;

      tiempo += dt;
      progreso = calcularProgreso(); // se recalcula cada cuadro: sigue el scroll en vivo
      if (puntos) puntos.rotation.y += dt * 0.02;
      actualizarObjetos();

      // El conjunto se inclina suavemente hacia el cursor (parallax sutil, encima del vuelo).
      conjunto.rotation.y = MathUtils.damp(conjunto.rotation.y, objetivoPuntero.x * 0.2, 3, dt);
      conjunto.rotation.x = MathUtils.damp(conjunto.rotation.x, -objetivoPuntero.y * 0.12, 3, dt);

      pintar();
      if (transcurrido < 1000) vigilarRendimiento(transcurrido);
    };

    const iniciar = () => {
      if (idCuadro || destruida || !animar) return;
      window.addEventListener("pointermove", alMoverPuntero, { passive: true });
      ultimoDibujo = 0;
      ultimoRaf = 0;
      calentamiento = CUADROS_CALENTAMIENTO;
      idCuadro = requestAnimationFrame(ciclo);
    };

    // Un cuadro inicial siempre; después, animación solo si corresponde y la portada se ve.
    pintar();
    if (visible) iniciar();

    // Si cambia el tamaño (o el largo de la pista de scroll), se recoloca y se redibuja.
    observador = new ResizeObserver(() => {
      if (destruida) return;
      ubicar();
      if (!idCuadro) {
        progreso = calcularProgreso();
        actualizarObjetos();
        pintar();
      }
    });
    observador.observe(host);

    return {
      setVisible(esVisible) {
        if (destruida) return;
        if (esVisible) iniciar();
        else detener();
      },
      destruir,
    };
  } catch (error) {
    destruir();
    throw error;
  }
}
