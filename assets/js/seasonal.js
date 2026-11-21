/*
  Temporadas del sitio (Navidad y futuras campañas).

  CÓMO ENCENDER O APAGAR LA NAVIDAD
  ---------------------------------
  Cambia solo SEASON_CONFIG.mode:
    "auto" -> se activa sola entre las fechas de SEASON_CONFIG.window (recomendado).
    "on"   -> siempre activa.
    "off"  -> siempre apagada (el sitio queda exactamente como sin temporada).

  Para probar sin tocar el código, abre la página con:
    ?temporada=navidad   (fuerza la temporada)
    ?temporada=off       (la apaga)

  Este archivo se carga en el <head> SIN defer a propósito, y es mínimo: solo
  marca <html data-season="navidad"> antes de pintar (sin parpadeo de estilos).
  Lo visual vive en assets/css/seasonal/navidad.css (solo aplica con ese
  atributo) y la decoración (guirnalda, nieve, cuenta regresiva) en
  assets/js/modules/temporada.js, que llega diferida con el resto del JS.
*/
(function () {
  "use strict";

  // Marca que hay JavaScript: solo así las leyendas esperan su entrada animada (sin JS se ven siempre).
  document.documentElement.classList.add("js");

  const SEASON_CONFIG = {
    name: "navidad",
    mode: "auto",
    // Formato MM-DD. El rango puede cruzar el año (15 nov -> 6 ene).
    window: { from: "11-15", to: "01-06" },
    themeColor: "#9e1b32"
  };

  const root = document.documentElement;

  const isInWindow = (today, from, to) => {
    const md = (today.getMonth() + 1) * 100 + today.getDate();
    const toNum = (value) => {
      const [month, day] = value.split("-").map(Number);
      return month * 100 + day;
    };
    const start = toNum(from);
    const end = toNum(to);
    return start <= end ? md >= start && md <= end : md >= start || md <= end;
  };

  const resolveSeason = () => {
    let override = null;
    try {
      override = new URLSearchParams(window.location.search).get("temporada");
    } catch (error) {
      override = null;
    }

    if (override === "off") return null;
    if (override === SEASON_CONFIG.name) return SEASON_CONFIG.name;
    if (SEASON_CONFIG.mode === "on") return SEASON_CONFIG.name;
    if (SEASON_CONFIG.mode === "auto" && isInWindow(new Date(), SEASON_CONFIG.window.from, SEASON_CONFIG.window.to)) {
      return SEASON_CONFIG.name;
    }
    return null;
  };

  const season = resolveSeason();
  if (!season) return;

  root.dataset.season = season;

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", SEASON_CONFIG.themeColor);

})();
