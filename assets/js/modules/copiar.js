// Botones «Copiar número» (data-copiar): copian el dato y lo anuncian en la región role="status" de la página.
export function initCopiar() {
  const botones = document.querySelectorAll("[data-copiar]");
  const estado = document.querySelector("[data-copiar-estado]");
  botones.forEach((boton) => {
    const textoOriginal = boton.firstChild.textContent;
    boton.addEventListener("click", async () => {
      let mensaje;
      try {
        // Si el navegador no responde (permiso pendiente), a los 1,5 s se muestra el número para copiarlo a mano.
        await Promise.race([navigator.clipboard.writeText(boton.dataset.copiar), new Promise((_, no) => setTimeout(() => no(new Error("sin respuesta")), 1500))]);
        mensaje = `Copiado: ${boton.dataset.copiar}`;
        boton.firstChild.textContent = "Copiado";
      } catch {
        mensaje = `No se pudo copiar. El número es ${boton.dataset.copiar}`;
      }
      if (estado) estado.textContent = mensaje;
      setTimeout(() => {
        boton.firstChild.textContent = textoOriginal;
        if (estado) estado.textContent = "";
      }, 2400);
    });
  });
}
