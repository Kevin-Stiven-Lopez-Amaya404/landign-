/*
  Interacciones principales de la portada (se carga con <script type="module">; en producción esbuild lo
  empaqueta y minifica: ver scripts/empaquetar.mjs).

  - modules/config.js centraliza selectores, preferencias de movimiento y datos de site.json.
  - Cada módulo de modules/ configura una sola funcionalidad (init*).
  - Lo que usa GSAP (animaciones.js) se carga aparte, después de la primera pintura.
*/
import { initEntrada } from "./modules/entrada.js";
import { initMenu } from "./modules/menu.js";
import { initActiveSection } from "./modules/active-section.js";
import { initReveal } from "./modules/reveal.js";
import { initContactForm } from "./modules/contact-form.js";
import { initTeamSlider } from "./modules/team-slider.js";
import { initLazyVideos } from "./modules/lazy-videos.js";
import { initEncaje } from "./modules/encaje.js";
import { initStoryBook } from "./modules/story-book.js";
import { initChatbot } from "./modules/chatbot.js";
import { initCompartir } from "./modules/compartir.js";
import { initEventos } from "./modules/eventos.js";
import { initCookies } from "./modules/cookies.js";
import { initTemporada } from "./modules/temporada.js";
import { initCarruseles } from "./modules/carruseles.js";

initEntrada();
initMenu();
initActiveSection();
initReveal();
initContactForm();
initTeamSlider();
initEncaje();
initLazyVideos();
initStoryBook();
initChatbot();
initCompartir();
initEventos();
initCookies();
initTemporada();
initCarruseles();
// Marca que la interacción ya arrancó (la usan las pruebas automáticas para no actuar antes de tiempo).
document.documentElement.dataset.listo = "";

// GSAP y las animaciones, después de la primera pintura (doble requestAnimationFrame).
requestAnimationFrame(() =>
  requestAnimationFrame(() => {
    import("./modules/animaciones.js").then(({ initAnimaciones }) => initAnimaciones());
  })
);
