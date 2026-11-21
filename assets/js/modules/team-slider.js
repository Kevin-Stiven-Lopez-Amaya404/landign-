import { SELECTORS, shouldLimitMotion } from "./config.js";

// Crea el carrusel del equipo con botones, puntos indicadores, pausa y avance automatico.
export function initTeamSlider() {
  const teamSlider = document.querySelector(SELECTORS.teamSlider);
  const teamPrev = document.querySelector(SELECTORS.teamPrev);
  const teamNext = document.querySelector(SELECTORS.teamNext);
  const teamDots = document.querySelector(SELECTORS.teamDots);

  if (!teamSlider) return;

  const cards = Array.from(teamSlider.querySelectorAll(".team-card-modern"));
  let currentIndex = 0;
  let autoTimer = null;
  let isPaused = false;
  let isVisible = false;
  let scrollTicking = false;

  const getDots = () => (teamDots ? Array.from(teamDots.querySelectorAll(".team-dot")) : []);

  const updateDots = () => {
    getDots().forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  };

  const goTo = (index, userAction = false) => {
    if (!cards.length) return;
    currentIndex = (index + cards.length) % cards.length;
    cards[currentIndex].scrollIntoView({
      behavior: shouldLimitMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest"
    });
    updateDots();

    if (userAction) {
      restartAuto();
    }
  };

  const next = () => goTo(currentIndex + 1);

  const stopAuto = () => {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  };

  const startAuto = () => {
    if (shouldLimitMotion || autoTimer || isPaused || !isVisible || cards.length <= 1) return;
    autoTimer = setInterval(next, 4200);
  };

  const restartAuto = () => {
    stopAuto();
    startAuto();
  };

  if (teamDots) {
    const fragment = document.createDocumentFragment();
    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "team-dot";
      dot.setAttribute("aria-label", `Ir al integrante ${index + 1}`);
      dot.addEventListener("click", () => goTo(index, true));
      fragment.appendChild(dot);
    });
    teamDots.replaceChildren(fragment);
  }

  updateDots();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries.some((entry) => entry.isIntersecting);
        if (isVisible) {
          startAuto();
        } else {
          stopAuto();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(teamSlider);
  } else {
    isVisible = true;
    startAuto();
  }

  // Con el foco dentro (teclado o lector de pantalla) también se detiene el avance automático (WCAG 2.2.2).
  teamSlider.addEventListener("focusin", () => {
    isPaused = true;
    stopAuto();
  });
  teamSlider.addEventListener("focusout", (event) => {
    if (teamSlider.contains(event.relatedTarget)) return;
    isPaused = false;
    startAuto();
  });

  teamSlider.addEventListener("mouseenter", () => {
    isPaused = true;
    stopAuto();
  });

  teamSlider.addEventListener("mouseleave", () => {
    isPaused = false;
    startAuto();
  });

  teamPrev?.addEventListener("click", () => goTo(currentIndex - 1, true));
  teamNext?.addEventListener("click", () => goTo(currentIndex + 1, true));

  teamSlider.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;

      requestAnimationFrame(() => {
        const center = teamSlider.scrollLeft + teamSlider.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, index) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(center - cardCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex !== currentIndex) {
          currentIndex = closestIndex;
          updateDots();
        }

        scrollTicking = false;
      });

      scrollTicking = true;
    },
    { passive: true }
  );

  window.addEventListener("resize", updateDots);
}
