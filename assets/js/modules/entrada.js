// Entrada: la decide un script en el <head> (clase con-entrada) para que no parpadee la página; no sale con
// movimiento reducido, ahorro de datos ni enlace a una sección. Es decorativa y no bloquea: el inicio ya está
// pintado detrás, se cierra sola a los 1,2 s o con el primer gesto (scroll, toque, clic o tecla) y no vuelve en la sesión.
export function initEntrada() {
  const raiz = document.documentElement;
  const entrada = document.getElementById("entrada");
  if (!entrada || !raiz.classList.contains("con-entrada")) {
    entrada?.remove();
    return;
  }

  const control = new AbortController();
  const cerrar = () => {
    control.abort();
    clearTimeout(reloj);
    try {
      sessionStorage.setItem("entrada", "1");
    } catch {
      // Sin almacenamiento (modo privado): la entrada vuelve a salir en la próxima visita, nada más.
    }
    // Solo cambia la entrada, no el <html>: quitar una clase del <html> recalculaba los estilos de toda la página
    // (casi 1 s en un celular lento). La clase con-entrada se queda; lo que importa es si #entrada existe.
    entrada.dataset.cerrada = "";
    document.dispatchEvent(new Event("entrada:cerrada"));
    const quitar = () => entrada.remove();
    entrada.classList.add("saliendo");
    entrada.addEventListener("transitionend", quitar, { once: true });
    setTimeout(quitar, 1000);
  };

  // 1,2 s contados desde que empezó a cargar la página (no desde que corre este script).
  const reloj = setTimeout(cerrar, Math.max(0, 1200 - performance.now()));
  const opciones = { signal: control.signal, passive: true };
  ["wheel", "touchstart", "pointerdown", "scroll"].forEach((tipo) => window.addEventListener(tipo, cerrar, opciones));
  document.addEventListener("keydown", cerrar, opciones);
  // «Saltar al contenido» también la cierra y lleva al contenido.
  document.querySelector(".skip-link")?.addEventListener("click", cerrar, opciones);
}
