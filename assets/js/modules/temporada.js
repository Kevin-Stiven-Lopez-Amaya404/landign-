// Decoración de la temporada (guirnalda, nieve, botón para pausarla y cuenta regresiva). La temporada la decide
// seasonal.js en el <head> (atributo data-season); este módulo llega diferido con main.js e interna.js.
const SEASON_CONFIG = {
  // Copos simultáneos. En móvil se usa la versión reducida.
  snowflakes: { desktop: 14, mobile: 6 }, // pocos y tenues: decoran sin tapar el texto
  storageKey: "fac-nieve"
};

export function initTemporada() {
  const season = document.documentElement.dataset.season;
  if (!season) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isSmall = window.matchMedia("(max-width: 760px)");

  const readSnowPreference = () => {
    try {
      return window.localStorage.getItem(SEASON_CONFIG.storageKey) !== "off";
    } catch (error) {
      return true;
    }
  };

  const saveSnowPreference = (isOn) => {
    try {
      window.localStorage.setItem(SEASON_CONFIG.storageKey, isOn ? "on" : "off");
    } catch (error) {
      /* Almacenamiento no disponible: la preferencia dura solo esta visita. */
    }
  };

  // Muestra los bloques marcados con data-season-only="navidad" (vienen con hidden en el HTML).
  const revealSeasonBlocks = () => {
    document.querySelectorAll(`[data-season-only="${season}"]`).forEach((element) => {
      element.hidden = false;
    });
  };

  // Guirnalda de luces bajo la barra superior. Decorativa: aria-hidden.
  const buildGarland = () => {
    const header = document.querySelector(".site-header");
    if (!header || header.querySelector(".xmas-garland")) return;

    const garland = document.createElement("div");
    garland.className = "xmas-garland";
    garland.setAttribute("aria-hidden", "true");

    const bulbs = Math.min(70, Math.ceil(window.screen.width / 46) + 1);
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < bulbs; index += 1) {
      const bulb = document.createElement("span");
      bulb.style.setProperty("--i", String(index));
      fragment.appendChild(bulb);
    }
    garland.appendChild(fragment);
    header.appendChild(garland);
  };

  // Nieve y destellos: solo transform/opacity (GPU), sin eventos de scroll. Solo cae en el inicio, en la
  // campaña de Navidad y en la portada de las páginas internas, detrás del texto; nunca sobre formularios.
  // Con «ahorro de datos» no se crea.
  const SNOW_AREAS = ".hero > .pantalla-fondo, .pagina-portada > .pantalla-fondo, #navidad:not([hidden])";
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let snowLayers = [];

  const buildSnowLayer = (area) => {
    const snowLayer = document.createElement("div");
    snowLayer.className = "xmas-snow";
    snowLayer.setAttribute("aria-hidden", "true");

    const total = isSmall.matches ? SEASON_CONFIG.snowflakes.mobile : SEASON_CONFIG.snowflakes.desktop;
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < total; index += 1) {
      const flake = document.createElement("span");
      const isSparkle = index % 4 === 0;
      flake.className = isSparkle ? "xmas-flake xmas-flake--sparkle" : "xmas-flake";
      flake.style.setProperty("--x", `${Math.round(Math.random() * 100)}vw`);
      flake.style.setProperty("--size", `${(isSparkle ? 8 : 4) + Math.random() * 5}px`);
      flake.style.setProperty("--duration", `${11 + Math.random() * 12}s`);
      flake.style.setProperty("--delay", `${-Math.random() * 20}s`);
      flake.style.setProperty("--drift", `${Math.round(Math.random() * 80 - 40)}px`);
      flake.style.setProperty("--alpha", (0.35 + Math.random() * 0.3).toFixed(2));
      fragment.appendChild(flake);
    }

    snowLayer.appendChild(fragment);
    area.prepend(snowLayer);
    return snowLayer;
  };

  const buildSnow = () => {
    if (snowLayers.length || reduceMotion.matches || saveData) return;
    snowLayers = Array.from(document.querySelectorAll(SNOW_AREAS), buildSnowLayer);
  };

  const removeSnow = () => {
    snowLayers.forEach((layer) => layer.remove());
    snowLayers = [];
  };

  // Botón para pausar la nieve (WCAG 2.2.2: todo movimiento de más de 5 s debe poder detenerse).
  const buildSnowToggle = () => {
    const menu = document.querySelector(".site-header .nav-list");
    if (!menu || reduceMotion.matches || saveData || menu.querySelector(".xmas-snow-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    // Va dentro del menú con el estilo de Compartir: la píldora no crece ni se desborda.
    button.className = "nav-compartir xmas-snow-toggle";
    button.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">' +
      '<path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17M9.2 3.6 12 5.8l2.8-2.2M9.2 20.4 12 18.2l2.8 2.2M3.6 10.4l2.9 1.6-2.9 1.6M20.4 10.4 17.5 12l2.9 1.6"/></svg>' +
      '<span class="xmas-snow-toggle-text"></span>';

    // Botón de alternar: su nombre es «Nieve» y aria-pressed dice si está activa (el texto visible es el nombre).
    button.querySelector(".xmas-snow-toggle-text").textContent = "Nieve";
    const render = (isOn) => button.setAttribute("aria-pressed", String(isOn));

    button.addEventListener("click", () => {
      const isOn = !snowLayers.length;
      if (isOn) {
        buildSnow();
      } else {
        removeSnow();
      }
      saveSnowPreference(isOn);
      render(isOn);
    });

    render(snowLayers.length > 0);
    const item = document.createElement("li");
    item.className = "nav-item--nieve";
    item.append(button);
    menu.append(item);
  };

  // Cuenta regresiva con la tradición colombiana: Novena (16-24 dic), Navidad y Año Nuevo.
  const updateCountdown = () => {
    const targets = document.querySelectorAll("[data-xmas-countdown]");
    if (!targets.length) return;

    const now = new Date();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const novena = new Date(year, 11, 16);
    const christmas = new Date(year, 11, 25);
    const daysTo = (date) => Math.round((date - startOfDay) / 86400000);

    let text;
    if (now.getMonth() === 0) {
      text = "¡Feliz Año Nuevo! Gracias por sembrar oportunidades con nosotros.";
    } else if (startOfDay < novena) {
      const days = daysTo(novena);
      text = `Faltan ${days} ${days === 1 ? "día" : "días"} para la Novena de Aguinaldos.`;
    } else if (startOfDay < christmas) {
      const day = daysTo(novena) * -1 + 1;
      text = day <= 9 ? `Estamos en la Novena de Aguinaldos: día ${day} de 9.` : "¡Es Nochebuena!";
    } else if (daysTo(christmas) === 0) {
      text = "¡Feliz Navidad de parte de toda la familia Amigos Como Arroz!";
    } else {
      text = "Gracias por una Navidad llena de oportunidades. ¡Feliz Año Nuevo!";
    }

    targets.forEach((target) => {
      target.textContent = text;
    });
  };

  const init = () => {
    revealSeasonBlocks();
    buildGarland();
    // La nieve solo aparece si hay dónde poner su botón de pausa.
    const canPause = Boolean(document.querySelector(".site-header .nav-list"));
    if (canPause && readSnowPreference()) buildSnow();
    buildSnowToggle();
    updateCountdown();

    // Si el usuario activa "reducir movimiento" con la página abierta, se retira la nieve.
    reduceMotion.addEventListener?.("change", (event) => {
      if (event.matches) {
        removeSnow();
        document.querySelector(".xmas-snow-toggle")?.remove();
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

}
