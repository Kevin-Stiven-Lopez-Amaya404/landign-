/*
  JavaScript de las páginas internas (programas, sede y páginas de la raíz). Se carga con <script type="module">.
  Menú de la barra (el mismo de la portada), Compartir y el encaje de fotos de la portada interna.
*/
import { initMenu } from "./modules/menu.js";
import { initCompartir } from "./modules/compartir.js";
import { initEncaje } from "./modules/encaje.js";
import { initEventos } from "./modules/eventos.js";
import { initCookies } from "./modules/cookies.js";
import { initCopiar } from "./modules/copiar.js";
import { initTemporada } from "./modules/temporada.js";

initMenu();
initCompartir();
initEncaje();
initEventos();
initCookies();
initCopiar();
initTemporada();
document.documentElement.dataset.listo = ""; // la interacción ya arrancó (para las pruebas)
