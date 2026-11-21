// Eventos de analítica. Solo se envían si Google Analytics está cargado (la persona aceptó las cookies y hay
// un ID en site.json); si no, no pasa nada. Cualquier elemento con data-analytics-event se registra al hacer clic.
export function registrarEvento(evento, categoria = "interaccion", etiqueta = "") {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", evento, { event_category: categoria, event_label: etiqueta });
}

export function initEventos() {
  document.addEventListener("click", (event) => {
    const origen = event.target.closest("[data-analytics-event]");
    if (!origen) return;
    registrarEvento(origen.dataset.analyticsEvent, origen.dataset.analyticsCategory, origen.dataset.analyticsLabel || origen.textContent.trim());
  });
}
