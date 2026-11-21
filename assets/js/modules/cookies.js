import { SITE_DATA } from "./config.js";
import { registrarEvento } from "./eventos.js";

// Aviso de cookies y carga de Google Analytics (GA4) solo con permiso.
// - Sin ID en site.json (analytics.ga4) no hay aviso ni analítica.
// - La decisión se guarda en localStorage («aceptadas» o «rechazadas»); si el almacenamiento falla, el aviso
//   vuelve a salir en la próxima visita y no se carga nada.
// - «Preferencias de cookies» (en el pie, data-preferencias-cookies) vuelve a mostrar el aviso.
const CLAVE = "fac-cookies";

const leer = () => {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
};
const guardar = (valor) => {
  try {
    localStorage.setItem(CLAVE, valor);
  } catch {
    /* Sin almacenamiento: la decisión vale solo para esta visita. */
  }
};

function cargarAnalitica(id) {
  if (window.gtag) return;
  window[`ga-disable-${id}`] = false;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}

export function initCookies() {
  const id = String(SITE_DATA.analytics?.ga4 || "").trim();
  const preferencias = document.querySelectorAll("[data-preferencias-cookies]");
  if (!/^G-[A-Z0-9]+$/.test(id)) return;
  preferencias.forEach((boton) => (boton.hidden = false));

  let aviso = null;
  const cerrar = () => {
    aviso?.remove();
    aviso = null;
  };
  const decidir = (acepta) => {
    guardar(acepta ? "aceptadas" : "rechazadas");
    if (acepta) {
      cargarAnalitica(id);
      registrarEvento("cookies_aceptadas", "privacidad");
    } else {
      window[`ga-disable-${id}`] = true; // si ya estaba cargada, deja de medir desde ahora
    }
    cerrar();
  };

  const mostrar = (moverFoco = false) => {
    if (aviso) return;
    aviso = document.createElement("section");
    aviso.className = "aviso-cookies";
    aviso.setAttribute("aria-labelledby", "aviso-cookies-titulo");
    const raiz = document.querySelector('link[rel="manifest"]')?.getAttribute("href").replace("site.webmanifest", "") ?? "";
    aviso.innerHTML = `
      <p class="aviso-cookies-titulo" id="aviso-cookies-titulo">Cookies de medición</p>
      <p>Usamos Google Analytics para saber cuántas personas visitan el sitio y mejorarlo. Solo se activa si aceptas.
        <a href="${raiz}privacidad.html">Más información</a>.</p>
      <div class="aviso-cookies-botones">
        <button class="btn btn-secondary" type="button" data-cookies="rechazar">Rechazar</button>
        <button class="btn btn-secondary" type="button" data-cookies="aceptar">Aceptar</button>
      </div>`;
    aviso.querySelector('[data-cookies="aceptar"]').addEventListener("click", () => decidir(true));
    aviso.querySelector('[data-cookies="rechazar"]').addEventListener("click", () => {
      registrarEvento("cookies_rechazadas", "privacidad");
      decidir(false);
    });
    document.body.append(aviso);
    if (moverFoco) aviso.querySelector("button").focus();
  };

  preferencias.forEach((boton) => boton.addEventListener("click", () => mostrar(true)));

  const decision = leer();
  if (decision === "aceptadas") cargarAnalitica(id);
  else if (decision !== "rechazadas") mostrar();
}
