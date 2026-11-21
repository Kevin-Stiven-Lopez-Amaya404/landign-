import { SELECTORS } from "./config.js";
import { registrarEvento } from "./eventos.js";

// Carga cada video solo cuando la persona pulsa su póster (evita peso inicial). El video llega con controles
// nativos, el póster, un nombre accesible y, si el botón trae data-captions (ruta a un .vtt), subtítulos en español.
export function initLazyVideos() {
  document.querySelectorAll(SELECTORS.localVideoLoader).forEach((button) => {
    button.addEventListener("click", () => {
      const videoSrc = button.dataset.videoSrc;
      if (!videoSrc) return;

      const video = document.createElement("video");
      video.className = button.className.replace("local-video-loader", "").trim();
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "none";
      video.poster = button.dataset.poster || "";
      video.setAttribute("aria-label", button.dataset.label || "Video");
      video.title = button.dataset.label || "Video";

      const source = document.createElement("source");
      source.src = videoSrc;
      source.type = "video/mp4";
      video.appendChild(source);

      if (button.dataset.captions) {
        const pista = document.createElement("track");
        pista.kind = "captions";
        pista.srclang = "es";
        pista.label = "Español";
        pista.src = button.dataset.captions;
        pista.default = true;
        video.appendChild(pista);
      }

      video.append("Tu navegador no puede reproducir este video.");
      button.replaceWith(video);
      registrarEvento("reproducir_video", "videos", button.dataset.label || videoSrc);
      video.play().catch(() => {});
    });
  });
}
