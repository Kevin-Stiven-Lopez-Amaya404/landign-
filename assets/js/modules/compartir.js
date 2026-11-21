// Botón Compartir (data-compartir): el menú nativo del teléfono (Web Share API); si no existe, copia el enlace
// y lo anuncia en una región role="status" que el lector de pantalla lee, además del aviso visible.
export function initCompartir() {
  const botones = document.querySelectorAll("[data-compartir]");
  if (!botones.length) return;
  const anuncio = document.createElement("p");
  anuncio.className = "sr-only";
  anuncio.setAttribute("role", "status");
  document.body.append(anuncio);

  botones.forEach((boton) => {
    boton.addEventListener("click", async () => {
      const datos = { title: document.title, url: location.href.split("#")[0] };
      try {
        if (navigator.share) {
          await navigator.share(datos);
          return;
        }
        await navigator.clipboard.writeText(datos.url);
        avisar(boton, anuncio, "Enlace copiado");
      } catch (error) {
        if (error?.name !== "AbortError") avisar(boton, anuncio, "No se pudo compartir. Copia el enlace de la barra del navegador.");
      }
    });
  });
}

function avisar(boton, anuncio, texto) {
  anuncio.textContent = texto;
  boton.querySelector(".carril-aviso")?.remove();
  const aviso = document.createElement("span");
  aviso.className = "carril-aviso";
  aviso.setAttribute("aria-hidden", "true");
  aviso.textContent = texto;
  boton.append(aviso);
  setTimeout(() => {
    aviso.remove();
    anuncio.textContent = "";
  }, 2400);
}
