/*
  Analitica opcional del sitio.

  Para activar el conteo real de visitas, reemplaza G-XXXXXXXXXX por tu ID
  de Google Analytics 4.
*/
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

(function () {
  const measurementId = GA_MEASUREMENT_ID.trim();

  if (!measurementId || measurementId === "G-XXXXXXXXXX") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-analytics-event]");
    if (!link || typeof window.gtag !== "function") return;

    window.gtag("event", link.dataset.analyticsEvent, {
      event_category: link.dataset.analyticsCategory || "interaccion",
      event_label: link.dataset.analyticsLabel || link.textContent.trim()
    });
  });
})();
