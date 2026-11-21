import { SELECTORS } from "./config.js";
import { atraparFoco } from "./foco.js";

// Controla el menú (en celular y tableta, un panel encima de la píldora) como un diálogo: mientras está abierto
// el foco queda dentro (panel y botón), Escape lo cierra y el foco vuelve al botón; aria-expanded al día.
export function initMenu() {
  const siteHeader = document.querySelector(SELECTORS.siteHeader);
  const menuToggle = document.querySelector(SELECTORS.menuToggle);
  const navList = document.querySelector(SELECTORS.navList);
  const menuBackdrop = document.querySelector(SELECTORS.menuBackdrop);
  const navLinks = document.querySelectorAll(SELECTORS.navLinks);

  if (!siteHeader || !menuToggle || !navList) return;

  let soltarFoco = null;
  const setMenuState = (isOpen) => {
    soltarFoco?.();
    soltarFoco = isOpen ? atraparFoco(navList, menuToggle) : null;
    navList.classList.toggle("open", isOpen);
    menuToggle.classList.toggle("open", isOpen);
    siteHeader.classList.toggle("menu-is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    if (menuBackdrop) {
      menuBackdrop.hidden = !isOpen;
    }

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  };

  const closeMenu = () => {
    if (navList.classList.contains("open")) {
      setMenuState(false);
    }
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = !navList.classList.contains("open");
    setMenuState(isOpen);
    // El botón va después de la lista en el HTML: sin esto, Tab saltaría el menú abierto.
    if (isOpen) requestAnimationFrame(() => navList.querySelector("a")?.focus());
  });

  menuBackdrop?.addEventListener("click", () => {
    closeMenu();
    menuToggle.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navList.classList.contains("open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 840) {
      closeMenu();
    }
  });

  return { siteHeader, menuToggle, navList, closeMenu };
}
