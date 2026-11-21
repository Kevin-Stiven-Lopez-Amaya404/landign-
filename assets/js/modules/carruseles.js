// Carruseles accesibles (todo elemento .carrusel con tarjetas .historia):
// - aria-roledescription «carrusel» y cada tarjeta como «diapositiva N de T»;
// - botones Anterior y Siguiente visibles (el del equipo ya trae los suyos: team-slider.js los maneja);
// - flechas izquierda y derecha del teclado cuando el foco está dentro del carrusel;
// - la posición («2 de 5») se anuncia en una región role="status" cuando la persona cambia de tarjeta.
// No atrapa el foco: Tab sigue saliendo del carrusel de forma normal.
export function initCarruseles() {
  document.querySelectorAll(".carrusel").forEach((carrusel, n) => {
    const tarjetas = Array.from(carrusel.children).filter((el) => el.matches(".historia"));
    if (tarjetas.length < 2) return;
    const total = tarjetas.length;
    carrusel.setAttribute("aria-roledescription", "carrusel");
    tarjetas.forEach((tarjeta, i) => {
      tarjeta.setAttribute("role", "group");
      tarjeta.setAttribute("aria-roledescription", "diapositiva");
      tarjeta.setAttribute("aria-label", `${i + 1} de ${total}`);
    });

    const estado = document.createElement("p");
    estado.className = "sr-only";
    estado.setAttribute("role", "status");

    const nombre = carrusel.getAttribute("aria-label") || "Carrusel";
    const propios = carrusel.id === "teamSlider" ? [document.getElementById("teamPrev"), document.getElementById("teamNext")] : null;
    let [anterior, siguiente] = propios || [];
    if (!propios) {
      const controles = document.createElement("div");
      controles.className = "carrusel-controles";
      const boton = (texto, flecha) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "team-slider-btn";
        b.setAttribute("aria-label", `${texto}: ${nombre.toLowerCase()}`);
        b.setAttribute("aria-controls", carrusel.id || (carrusel.id = `carrusel-${n + 1}`));
        b.innerHTML = `<span aria-hidden="true">${flecha}</span>`;
        return b;
      };
      anterior = boton("Anterior", "&larr;");
      siguiente = boton("Siguiente", "&rarr;");
      controles.append(anterior, siguiente, estado);
      carrusel.after(controles);
    } else {
      carrusel.after(estado);
    }

    // Tarjeta actual: la más cercana al borde izquierdo visible del carrusel.
    const actual = () => {
      const borde = carrusel.getBoundingClientRect().left;
      let mejor = 0;
      let distancia = Infinity;
      tarjetas.forEach((t, i) => {
        const d = Math.abs(t.getBoundingClientRect().left - borde);
        if (d < distancia) {
          distancia = d;
          mejor = i;
        }
      });
      return mejor;
    };
    const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ir = (i) => {
      const destino = Math.max(0, Math.min(total - 1, i));
      const delta = tarjetas[destino].getBoundingClientRect().left - carrusel.getBoundingClientRect().left;
      carrusel.scrollBy({ left: delta, behavior: reducido ? "auto" : "smooth" });
      avisar(destino);
    };
    let ultimo = -1;
    const avisar = (i) => {
      if (i === ultimo) return;
      ultimo = i;
      estado.textContent = `${nombre}: ${i + 1} de ${total}`;
    };
    const bordes = () => {
      const alInicio = carrusel.scrollLeft <= 4;
      const alFinal = carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 4;
      anterior?.setAttribute("aria-disabled", String(alInicio));
      siguiente?.setAttribute("aria-disabled", String(alFinal));
    };

    if (!propios) {
      anterior.addEventListener("click", () => ir(actual() - 1));
      siguiente.addEventListener("click", () => ir(actual() + 1));
    } else {
      [anterior, siguiente].forEach((b) => b?.addEventListener("click", () => setTimeout(() => avisar(actual()), 400)));
    }

    carrusel.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      if (event.target.closest("input, textarea, select, video")) return;
      event.preventDefault();
      ir(actual() + (event.key === "ArrowRight" ? 1 : -1));
    });

    let espera;
    carrusel.addEventListener(
      "scroll",
      () => {
        clearTimeout(espera);
        espera = setTimeout(bordes, 120);
      },
      { passive: true }
    );
    bordes();
  });
}
