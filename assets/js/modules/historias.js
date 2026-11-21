import { gsap } from "../vendor/gsap.js";

// Indicador segmentado de historias: un segmento por pantalla de la portada, que se llena con el scroll
// (ScrollTrigger de GSAP). Cada segmento lleva a su pantalla.
// También maneja el botón Compartir de la barra.
export function initHistorias() {
  const nav = document.querySelector("#historias");
  const secciones = Array.from(document.querySelectorAll("main > section[id]")).filter((s) => !s.hidden);

  if (nav && secciones.length) {
    const segmentos = secciones.map((seccion) => {
      const titulo = document.getElementById(seccion.getAttribute("aria-labelledby") || "")?.textContent.trim() || seccion.id;
      const enlace = document.createElement("a");
      enlace.href = `#${seccion.id}`;
      enlace.setAttribute("aria-label", titulo.replace(/\s+/g, " "));
      const relleno = document.createElement("span");
      enlace.append(relleno);
      nav.append(enlace);
      // El segmento queda lleno cuando su pantalla ya salió por arriba.
      gsap.fromTo(relleno, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: seccion, start: "top top", end: "bottom top", scrub: true } });
      return enlace;
    });

    // Marca la pantalla actual (la que ocupa el centro de la ventana).
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const indice = secciones.indexOf(entrada.target);
          segmentos.forEach((s, i) => s.setAttribute("aria-current", String(i === indice)));
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    secciones.forEach((s) => observador.observe(s));
  }
}
