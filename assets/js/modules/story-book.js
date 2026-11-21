import { SELECTORS } from "./config.js";

// Visor de la historia institucional: una página a la vez, con indicador segmentado como las historias.
// Todas las páginas siguen en el HTML; las que no se ven quedan con hidden.
// Accesible: flechas del teclado dentro del libro, y en los extremos los botones quedan con aria-disabled
// (no disabled) para que el foco no se pierda al llegar a la primera o la última página.
export function initStoryBook() {
  document.querySelectorAll(SELECTORS.storyBook).forEach((book) => {
    const pages = Array.from(book.querySelectorAll(SELECTORS.storyPage));
    const prevButton = book.querySelector(SELECTORS.storyPrev);
    const nextButton = book.querySelector(SELECTORS.storyNext);
    const status = book.querySelector(SELECTORS.storyStatus);

    if (!pages.length || !prevButton || !nextButton || !status) return;

    const segmentos = document.createElement("div");
    segmentos.className = "story-book-segmentos";
    segmentos.setAttribute("aria-hidden", "true");
    pages.forEach(() => segmentos.append(document.createElement("span")));
    book.prepend(segmentos);

    let current = 0;

    const render = () => {
      pages.forEach((page, index) => {
        page.hidden = index !== current;
        segmentos.children[index].className = index < current ? "is-done" : index === current ? "is-current" : "";
      });
      prevButton.setAttribute("aria-disabled", String(current === 0));
      nextButton.setAttribute("aria-disabled", String(current === pages.length - 1));
      status.textContent = `Página ${current + 1} de ${pages.length}`;
    };

    const go = (step) => {
      const next = Math.min(pages.length - 1, Math.max(0, current + step));
      if (next === current) return;
      current = next;
      render();
    };

    prevButton.addEventListener("click", () => go(-1));
    nextButton.addEventListener("click", () => go(1));
    book.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else return;
      event.preventDefault();
    });

    render();
  });
}
