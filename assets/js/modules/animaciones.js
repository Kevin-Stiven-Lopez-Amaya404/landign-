// Todo lo que usa GSAP en la portada. main.js lo importa de forma diferida, después de la primera pintura:
// así GSAP (unos 48 KB comprimido) no retrasa el inicio y solo se descarga en la portada.
// Cada parte arranca en su propia tarea para no bloquear la página en celulares lentos.
import { initHistorias } from "./historias.js";
import { initMovimiento } from "./movimiento.js";
import { initPortada } from "./portada.js";

const ceder = () => (globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((listo) => setTimeout(listo, 0)));

export async function initAnimaciones() {
  initMovimiento(); // primero: la entrada del inicio
  await ceder();
  initPortada();
  await ceder();
  initHistorias();
}
