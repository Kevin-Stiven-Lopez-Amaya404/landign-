/*
  JavaScript:
  - Menú móvil
  - Scroll reveal con delay progresivo
  - Contadores animados
  - Barra de progreso de lectura
  - Parallax sutil del hero
  - Validación básica del formulario
*/

const siteHeader = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navList = document.querySelector("#nav-list");
const menuBackdrop = document.querySelector("#menu-backdrop");
const navLinks = document.querySelectorAll(".nav-link");
const progressBar = document.querySelector("#reading-progress-bar");
const hero = document.querySelector(".hero");
const heroContent = document.querySelector("#hero-content");

window.addEventListener("load", () => {
  heroContent.classList.add("is-ready");
});

function setMenuState(isOpen) {
  navList.classList.toggle("open", isOpen);
  menuToggle.classList.toggle("open", isOpen);
  siteHeader.classList.toggle("menu-is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);

  if (menuBackdrop) {
    menuBackdrop.hidden = !isOpen;
  }

  siteHeader.classList.remove("is-hidden");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
}

function closeMenu() {
  if (!navList.classList.contains("open")) return;
  setMenuState(false);
}

function toggleMenu() {
  setMenuState(!navList.classList.contains("open"));
}

menuToggle.addEventListener("click", toggleMenu);
menuBackdrop?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

siteHeader.addEventListener("focusin", () => {
  siteHeader.classList.remove("is-hidden");
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


/*
  Activar automáticamente el enlace del menú según la sección visible.
*/
const sections = document.querySelectorAll("main section[id]");

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeId = entry.target.id;

      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === `#${activeId}`);
      });
    });
  },
  {
    threshold: 0.35,
    rootMargin: "-18% 0px -58% 0px"
  }
);

sections.forEach((section) => activeSectionObserver.observe(section));

document.querySelector("#current-year").textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");
const animatedCounters = new WeakSet();

/*
  Delay progresivo para que las tarjetas no aparezcan todas al mismo tiempo.
*/
revealElements.forEach((element, index) => {
  const delay = Math.min(index * 55, 300);
  element.style.setProperty("--delay", `${delay}ms`);
});

function animateCounter(counter) {
  const target = Number(counter.dataset.counter);
  const duration = 1300;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);

    counter.textContent = value.toLocaleString("es-CO");

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target.toLocaleString("es-CO");
    }
  }

  requestAnimationFrame(update);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");

      const counters = entry.target.querySelectorAll("[data-counter]");
      counters.forEach((counter) => {
        if (animatedCounters.has(counter)) return;

        animatedCounters.add(counter);

        if (prefersReducedMotion) {
          const target = Number(counter.dataset.counter);
          counter.textContent = target.toLocaleString("es-CO");
        } else {
          animateCounter(counter);
        }
      });

      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -50px 0px"
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

/*
  Barra de progreso superior optimizada.
*/
let lastScrollY = window.scrollY;
let scrollTicking = false;

function updateReadingProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;

  const quickContact = document.querySelector("#quick-contact");
  const contactSection = document.querySelector("#contacto");

  if (quickContact && contactSection) {
    const contactTop = contactSection.getBoundingClientRect().top;
    quickContact.classList.toggle("is-hidden", contactTop < window.innerHeight * 0.65);
  }

  /*
    Nuevo comportamiento:
    - Si el usuario baja, ocultamos la navegación.
    - Si el usuario sube un poco, la mostramos de nuevo.
    - Cerca del inicio siempre permanece visible.
  */
  const isScrollingDown = scrollTop > lastScrollY;
  const isNearTop = scrollTop < 120;
  const menuIsOpen = navList.classList.contains("open");

  if (isNearTop || !isScrollingDown || menuIsOpen) {
    siteHeader.classList.remove("is-hidden");
  } else {
    siteHeader.classList.add("is-hidden");

    navList.classList.remove("open");
    menuToggle.classList.remove("open");
    siteHeader.classList.remove("menu-is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
  }

  lastScrollY = Math.max(scrollTop, 0);
  scrollTicking = false;
}

function requestScrollTick() {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateReadingProgress);
    scrollTicking = true;
  }
}

window.addEventListener("scroll", requestScrollTick, { passive: true });
updateReadingProgress();

/*
  Parallax sutil del hero en desktop.
*/
if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    hero.style.setProperty("--hero-x", `${48 + (x - 50) * 0.04}%`);
    hero.style.setProperty("--hero-y", `${50 + (y - 50) * 0.04}%`);
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.setProperty("--hero-x", "50%");
    hero.style.setProperty("--hero-y", "50%");
  });
}

/*
  Validación básica de formulario.
  En producción, conectar con backend, CRM, Formspree, Netlify Forms o API propia.
*/
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name")).trim();
  const phone = String(data.get("phone")).trim();
  const email = String(data.get("email")).trim();
  const interest = String(data.get("interest")).trim();
  const message = String(data.get("message")).trim();

  if (!name || !phone || !email || !interest || !message) {
    status.textContent = "Por favor completa todos los campos.";
    status.style.color = "#b42318";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    status.textContent = "Ingresa un correo electrónico válido.";
    status.style.color = "#b42318";
    return;
  }

  const whatsappMessage = [
    "Hola, quiero contactar a la Fundación Amigos Como Arroz.",
    "",
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    `Correo: ${email}`,
    `Interés: ${interest}`,
    "",
    `Mensaje: ${message}`
  ].join("\n");

  const whatsappUrl = `https://wa.me/573187073308?text=${encodeURIComponent(whatsappMessage)}`;

  status.textContent = "Te redirigiremos a WhatsApp para completar el envío.";
  status.style.color = "#5f8f73";

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  form.reset();
});

/*
  Carrusel del equipo:
  - Automático
  - Delicado
  - Pausa al interactuar
  - Indicadores sincronizados
*/
const teamSlider = document.querySelector("#teamSlider");
const teamPrev = document.querySelector("#teamPrev");
const teamNext = document.querySelector("#teamNext");
const teamDots = document.querySelector("#teamDots");
const scrollTopBtn = document.querySelector("#scrollTopBtn");

if (teamSlider) {
  const cards = Array.from(teamSlider.querySelectorAll(".team-card-modern"));
  let currentIndex = 0;
  let autoTimer = null;
  let isPaused = false;

  const buildDots = () => {
    if (!teamDots) return;
    teamDots.innerHTML = "";
    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "team-dot";
      dot.setAttribute("aria-label", `Ir al integrante ${index + 1}`);
      dot.addEventListener("click", () => goTo(index, true));
      teamDots.appendChild(dot);
    });
  };

  const dots = () => teamDots ? Array.from(teamDots.querySelectorAll(".team-dot")) : [];

  const updateDots = () => {
    dots().forEach((dot, index) => dot.classList.toggle("active", index === currentIndex));
  };

  const goTo = (index, userAction = false) => {
    if (!cards.length) return;
    currentIndex = (index + cards.length) % cards.length;
    cards[currentIndex].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    updateDots();
    if (userAction) restartAuto();
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  const startAuto = () => {
    if (autoTimer || isPaused || cards.length <= 1) return;
    autoTimer = setInterval(next, 4200);
  };

  const stopAuto = () => {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  };

  const restartAuto = () => {
    stopAuto();
    if (!isPaused) startAuto();
  };

  buildDots();
  updateDots();

  const sliderObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        stopAuto();
        return;
      }
      startAuto();
    });
  }, { threshold: 0.35 });

  sliderObserver.observe(teamSlider);

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

  teamSlider.addEventListener("scroll", () => {
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
  }, { passive: true });

  window.addEventListener("resize", updateDots);
  startAuto();
}

/*
  Botón para volver arriba con sensibilidad optimizada.
*/
function updateScrollTopButton() {
  if (!scrollTopBtn) return;
  // Aparece más temprano (200px) para mejor accesibilidad
  scrollTopBtn.classList.toggle("visible", window.scrollY > 200);
}

// Usar requestAnimationFrame para mejor rendimiento
let ticking = false;
function requestTick(callback) {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      callback();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener("scroll", () => {
  requestTick(updateScrollTopButton);
}, { passive: true });

updateScrollTopButton();

scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
