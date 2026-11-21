import { gsap, ScrollTrigger, SplitText } from "../vendor/gsap.js";

// Movimiento de la portada con GSAP: las mismas ideas de la web de referencia, escritas para este sitio.
// Todo vive dentro de gsap.matchMedia(): con «reducir movimiento» no se crea nada y, si cambia el ancho
// de la pantalla, GSAP deshace lo creado y lo vuelve a armar con la versión que corresponde.
const EXPO = "expo.out"; // salida exponencial, como la curva (0.16, 1, 0.3, 1) de la referencia
const REVELAR = { duration: 0.5, ease: EXPO };
const INICIO = { duration: 1.2, ease: EXPO };

export function initMovimiento() {
  const mm = gsap.matchMedia();
  mm.add(
    {
      movimiento: "(prefers-reduced-motion: no-preference)",
      escritorio: "(min-width: 900px) and (min-height: 640px)",
      mouse: "(hover: hover) and (pointer: fine)"
    },
    (contexto) => {
      const { movimiento, escritorio, mouse } = contexto.conditions;
      if (!movimiento) return;
      // GSAP deshace solo tweens, ScrollTriggers, SplitText y Draggable; los oyentes propios se limpian aquí.
      // Lo del inicio se arma ya; lo demás, en tareas cortas separadas (una por efecto) para no bloquear la
      // página: armarlo todo de una vez era una tarea de ~1 s en un celular (Lighthouse, HU26).
      const limpiezas = [introInicio(), inicioAlBajar(), rebote()];
      const pasos = [
        () => titulos(contexto),
        fotos,
        tarjetas,
        () => textoSonador(escritorio),
        () => espinal(escritorio),
        escritorio && programasApilados,
        mouse && carruseles
      ].filter(Boolean);
      let cancelado = false;
      (async () => {
        for (const paso of pasos) {
          await ceder();
          if (cancelado) return;
          contexto.add(() => limpiezas.push(paso()));
        }
        // Las escenas fijas agregan espacio: se ordenan los ScrollTrigger por posición y se recalculan.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      })();
      return () => {
        cancelado = true;
        limpiezas.forEach((limpiar) => typeof limpiar === "function" && limpiar());
      };
    }
  );
  // Las fuentes y las fotos cambian el alto de la página: se recalculan los puntos de inicio.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

// Cede el hilo principal al navegador entre tarea y tarea.
const ceder = () => (globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((listo) => setTimeout(listo, 0)));

// Entrada del inicio: la foto crece y el nombre sube línea a línea (tras «Entrar», o al cargar si no hay entrada).
function introInicio() {
  const raiz = document.documentElement;
  const hero = document.querySelector(".hero");
  if (!hero || !raiz.classList.contains("intro")) return;
  const fondo = hero.querySelector(".pantalla-fondo");
  const nombre = SplitText.create(hero.querySelector(".hero-title"), { type: "lines", mask: "lines" });

  const tl = gsap.timeline({ paused: true, onStart: () => raiz.classList.remove("intro") });
  // La foto se pinta desde el primer momento (detrás de la entrada): solo se asienta, sin aparecer de la nada.
  tl.fromTo(fondo, { scale: 1.12 }, { scale: 1, ...INICIO }, 0)
    .fromTo(nombre.lines, { yPercent: 110 }, { yPercent: 0, ...INICIO, stagger: 0.12 }, 0.9)
    .fromTo(hero.querySelector(".hero-title"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.9)
    .fromTo(hero.querySelector(".hero-badge"), { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, ...REVELAR }, 0.95)
    .fromTo(hero.querySelectorAll(".hero-kicker, .hero-description"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ...REVELAR, stagger: 0.06 }, 1.1)
    .fromTo(hero.querySelectorAll(".hero-actions, .xmas-hero-pill"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, ...REVELAR }, 1.2)
    .fromTo(hero.querySelectorAll(".hero-sello, .siguiente"), { autoAlpha: 0 }, { autoAlpha: 1, ...REVELAR, stagger: 0.15 }, 1.2);

  const empezar = () => tl.play();
  const entradaAbierta = document.querySelector("#entrada:not([data-cerrada])");
  if (raiz.classList.contains("con-entrada") && entradaAbierta) document.addEventListener("entrada:cerrada", empezar, { once: true });
  else empezar();
  return () => document.removeEventListener("entrada:cerrada", empezar);
}

// Al bajar, la foto del inicio se aleja, se acerca por dentro y se apaga.
function inicioAlBajar() {
  const hero = document.querySelector(".hero");
  const fondo = hero?.querySelector(".pantalla-fondo");
  if (!fondo) return;
  const scrollTrigger = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
  gsap.to(fondo, { y: 90, opacity: 0.3, ease: "none", scrollTrigger });
  gsap.to(fondo.querySelectorAll("img"), { scale: 1.08, ease: "none", scrollTrigger });
}

// Títulos de sección: las letras se encienden una tras otra al entrar (como el «Statement» de la referencia).
// Cada título se divide en letras solo cuando está por aparecer, no todos al cargar.
function titulos(contexto) {
  gsap.utils.toArray("main > section h2").forEach((titulo) => {
    if (titulo.closest(".programas-intro")) return; // ese título ya tiene su propio efecto
    ScrollTrigger.create({
      trigger: titulo,
      start: "top bottom",
      once: true,
      onEnter: () =>
        contexto.add(() => {
          const split = SplitText.create(titulo, { type: "words,chars" });
          gsap.fromTo(split.chars, { opacity: 0.12 }, { opacity: 1, duration: 0.5, ease: EXPO, stagger: 0.026, delay: 0.15 });
        })
    });
  });
}

// Fotos: se descubren de abajo hacia arriba y se asientan; en Programas, además, se mueven más lento que la página.
function fotos() {
  gsap.utils.toArray(".marco-foto, .historia-foto, .timeline-item > img").forEach((caja) => {
    const img = caja.tagName === "IMG" ? null : caja.querySelector("img:not(.encaje-relleno)");
    const tl = gsap.timeline({ scrollTrigger: { trigger: caja, start: "top 88%", once: true } });
    tl.fromTo(caja, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EXPO, clearProps: "clipPath" });
    if (img) tl.fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.4, ease: EXPO, clearProps: "scale" }, 0);
  });

  gsap.utils.toArray(".program-card > .pantalla-fondo").forEach((caja) => {
    gsap.fromTo(caja, { clipPath: "inset(100% 0% 0% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: EXPO, clearProps: "clipPath",
      scrollTrigger: { trigger: caja, start: "top 88%", once: true }
    });
    const img = caja.querySelector("img");
    gsap.fromTo(img, { yPercent: -5, scale: 1.12 }, {
      yPercent: 5, ease: "none",
      scrollTrigger: { trigger: caja, start: "top bottom", end: "bottom top", scrub: true }
    });
  });
}

// Tarjetas de carruseles e informes: suben en grupo, una tras otra, cuando su fila entra a la pantalla.
function tarjetas() {
  const lista = gsap.utils.toArray(".carrusel > .historia, .report-row");
  if (!lista.length) return;
  gsap.set(lista, { autoAlpha: 0, y: 48 });
  ScrollTrigger.batch(lista, {
    start: "top 92%",
    once: true,
    onEnter: (grupo) => {
      // Las que ya quedaron arriba (al llegar con un enlace a otra sección) aparecen sin esperar su turno.
      const nuevas = grupo.filter((t) => t.getBoundingClientRect().bottom >= 0);
      gsap.set(grupo.filter((t) => !nuevas.includes(t)), { clearProps: "transform,opacity,visibility" });
      gsap.to(nuevas, { autoAlpha: 1, y: 0, duration: 0.9, ease: EXPO, stagger: 0.08, clearProps: "transform,opacity,visibility" });
    }
  });
}

// Intro de Programas: cada línea aparece al llegar y se va al salir (con desenfoque solo en escritorio).
function textoSonador(escritorio) {
  const intro = document.querySelector(".programas-intro");
  const encabezado = intro?.querySelector(".section-header");
  if (!encabezado) return;
  encabezado.classList.remove("reveal");
  const lineas = [encabezado.querySelector(".eyebrow"), encabezado.querySelector("h2"), encabezado.querySelector(".lead")].filter(Boolean);
  const oculto = (subir) => ({ opacity: 0, y: subir ? "2.5rem" : "-2.5rem", filter: escritorio ? "blur(16px)" : "none" });
  lineas.forEach((linea, i) => {
    const retraso = i * 0.04;
    gsap.timeline({ scrollTrigger: { trigger: intro, start: "top bottom", end: "bottom top", scrub: true } })
      .set(linea, oculto(true), 0)
      .to(linea, { opacity: 1, y: 0, filter: "blur(0px)", ease: "none", duration: 0.26 }, 0.12 + retraso)
      .to(linea, { ...oculto(false), ease: "none", duration: 0.26 }, 0.62 - retraso)
      .set({}, {}, 1); // el tramo mide 1, igual que la sección: los tiempos de arriba son fracciones de ella
  });
}

// Sede Espinal: en escritorio la pantalla se queda fija mientras la foto se asienta, ESPINAL aparece desde un
// desenfoque y luego sube el texto (como «The Shift»). En celular, la misma idea sin fijar la pantalla.
function espinal(escritorio) {
  const sede = document.querySelector(".sede-espinal-section");
  if (!sede) return;
  const foto = sede.querySelector(".pantalla-fondo img");
  const palabra = sede.querySelector(".palabra-gigante");
  const copia = sede.querySelector(".sede-espinal-copy");
  const cabe = sede.offsetHeight <= window.innerHeight * 1.05;

  if (escritorio && cabe) {
    copia.classList.remove("reveal");
    gsap.timeline({ scrollTrigger: { trigger: sede, start: "top top", end: "+=90%", pin: true, scrub: 0.6 } })
      .fromTo(foto, { scale: 1.25 }, { scale: 1, ease: "none", duration: 1 }, 0)
      .fromTo(palabra, { autoAlpha: 0, filter: "blur(36px)", letterSpacing: "0.25em" }, { autoAlpha: 1, filter: "blur(0px)", letterSpacing: "0em", ease: "power2.out", duration: 0.55 }, 0)
      .fromTo(copia, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.45 }, 0.5);
    return;
  }
  gsap.fromTo(foto, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: sede, start: "top bottom", end: "top top", scrub: true } });
  gsap.fromTo(palabra, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ...INICIO, scrollTrigger: { trigger: sede, start: "top 75%", once: true } });
}

// Programas en escritorio: cada tarjeta se queda quieta cuando termina de verse y la siguiente sube por encima,
// mientras la de abajo se achica y se apaga un poco.
function programasApilados() {
  const tarjetas = gsap.utils.toArray(".programas-feed > .program-card");
  tarjetas.forEach((tarjeta, i) => {
    const siguiente = tarjetas[i + 1];
    if (!siguiente || tarjeta.offsetHeight > window.innerHeight * 1.1) return;
    // Fondo opaco en la fija y en la que la tapa (al fijarla, GSAP la envuelve y «+» en CSS ya no sirve).
    tarjeta.classList.add("apilada");
    siguiente.classList.add("apilada");
    ScrollTrigger.create({ trigger: tarjeta, start: "bottom bottom", endTrigger: siguiente, end: "top top", pin: true, pinSpacing: false });
    // Se achica y se apaga solo cuando la siguiente ya tapa media pantalla: mientras se lee, queda intacta.
    // fromTo sin render inmediato: si GSAP leyera la opacidad al crear, tomaría el 0 del texto aún sin revelar.
    gsap.fromTo(tarjeta.children, { scale: 1, opacity: 1 }, {
      scale: 0.94, opacity: 0.55, ease: "none", immediateRender: false,
      scrollTrigger: { trigger: siguiente, start: "top 55%", end: "top top", scrub: true }
    });
  });
  return () => tarjetas.forEach((tarjeta) => tarjeta.classList.remove("apilada"));
}

// Carruseles con mouse: se arrastran y, al soltar, siguen con inercia hasta frenar; el cursor muestra «Arrastra».
// (Hecho a mano: el modo «scroll» de Draggable envuelve el contenido y rompería la cuadrícula del carrusel.)
function carruseles() {
  const limpiezas = gsap.utils.toArray(".carrusel").map((carrusel) => {
    if (carrusel.scrollWidth <= carrusel.clientWidth + 4) return null;
    carrusel.dataset.cursor = "Arrastra";
    carrusel.classList.add("arrastrable");
    let inicioX = 0, inicioScroll = 0, ultimoX = 0, ultimoT = 0, velocidad = 0, arrastrando = false, movio = false;

    const bajar = (e) => {
      // Sobre botones y enlaces también se arrastra; si la mano no se movió, su clic funciona normal.
      if (e.button !== 0 || e.target.closest("video, input, textarea, select")) return;
      arrastrando = true; movio = false;
      inicioX = ultimoX = e.clientX; inicioScroll = carrusel.scrollLeft; ultimoT = performance.now(); velocidad = 0;
      gsap.killTweensOf(carrusel);
      carrusel.classList.add("arrastrando");
    };
    const mover = (e) => {
      if (!arrastrando) return;
      const ahora = performance.now();
      velocidad = (e.clientX - ultimoX) / Math.max(1, ahora - ultimoT);
      ultimoX = e.clientX; ultimoT = ahora;
      if (Math.abs(e.clientX - inicioX) > 4) movio = true;
      carrusel.scrollLeft = inicioScroll - (e.clientX - inicioX);
    };
    const soltar = () => {
      if (!arrastrando) return;
      arrastrando = false;
      carrusel.classList.remove("arrastrando");
      // Inercia: sigue en la dirección del gesto, proporcional a la velocidad final, y frena suave.
      gsap.to(carrusel, { scrollLeft: carrusel.scrollLeft - velocidad * 420, duration: 0.9, ease: "power3.out" });
    };
    // Un arrastre no debe contar como clic en una tarjeta.
    const clic = (e) => { if (movio) { e.preventDefault(); e.stopPropagation(); movio = false; } };

    carrusel.addEventListener("pointerdown", bajar);
    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerup", soltar);
    carrusel.addEventListener("click", clic, true);
    const sinArrastreNativo = (e) => e.preventDefault(); // enlaces e imágenes no se «levantan» al arrastrar
    carrusel.addEventListener("dragstart", sinArrastreNativo);
    return () => {
      carrusel.removeEventListener("dragstart", sinArrastreNativo);
      carrusel.removeEventListener("pointerdown", bajar);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      carrusel.removeEventListener("click", clic, true);
      carrusel.classList.remove("arrastrable", "arrastrando");
      delete carrusel.dataset.cursor;
    };
  });
  return () => limpiezas.forEach((limpiar) => limpiar?.());
}

// «Sigue» da dos saltitos si la persona lleva 5 segundos quieta arriba de la página.
function rebote() {
  const sigue = document.querySelector(".siguiente");
  if (!sigue) return;
  const salto = gsap.timeline({ paused: true }).to(sigue, { y: -8, duration: 0.3, ease: "power2.inOut", yoyo: true, repeat: 3 });
  let espera;
  const armar = () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      if (window.scrollY < 80 && !document.querySelector("#entrada:not([data-cerrada])")) salto.restart();
      armar();
    }, 5000);
  };
  const eventos = ["scroll", "pointermove", "keydown", "touchstart"];
  eventos.forEach((evento) => window.addEventListener(evento, armar, { passive: true }));
  armar();
  return () => {
    clearTimeout(espera);
    eventos.forEach((evento) => window.removeEventListener(evento, armar));
  };
}
