/*
  Interacciones principales de la landing.

  Este archivo se mantiene separado del HTML para evitar codigo mezclado:
  - SELECTORS centraliza las clases e ids usados por JavaScript.
  - Cada init* configura una sola funcionalidad.
  - Al final se inicializan los modulos en un orden claro.
*/
const SELECTORS = {
  siteHeader: "#site-header",
  menuToggle: ".menu-toggle",
  navList: "#nav-list",
  menuBackdrop: "#menu-backdrop",
  navLinks: ".nav-link",
  sections: "main section[id]",
  progressBar: "#reading-progress-bar",
  hero: ".hero",
  heroSlides: ".hero-slide",
  heroGalleryDots: ".hero-gallery-dots span",
  heroContent: "#hero-content",
  currentYear: "#current-year",
  reveal: ".reveal",
  quickContact: "#quick-contact",
  contactSection: "#contacto",
  form: "#contact-form",
  formStatus: "#form-status",
  teamSlider: "#teamSlider",
  teamPrev: "#teamPrev",
  teamNext: "#teamNext",
  teamDots: "#teamDots",
  scrollTopButton: "#scrollTopBtn",
  lazyVideo: ".video-lazy",
  chatbotToggle: "#chatbotToggle",
  chatbotPanel: "#chatbotPanel",
  chatbotClose: "#chatbotClose",
  chatbotMessages: "#chatbotMessages",
  chatbotForm: "#chatbotForm",
  chatbotInput: "#chatbotInput",
  chatbotQuick: "[data-chat-question]"
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefersReducedData = window.matchMedia("(prefers-reduced-data: reduce)").matches;
const isSmallViewport = window.matchMedia("(max-width: 760px)").matches;
const isLikelyLowMemory = "deviceMemory" in navigator && navigator.deviceMemory <= 4;
const shouldLimitMotion = prefersReducedMotion || prefersReducedData || isSmallViewport || isLikelyLowMemory;

// Prepara la imagen principal y aplica un movimiento sutil solo en equipos con mouse.
function initHero() {
  const hero = document.querySelector(SELECTORS.hero);
  const heroContent = document.querySelector(SELECTORS.heroContent);

  requestAnimationFrame(() => {
    heroContent?.classList.add("is-ready");
  });

  if (!hero || shouldLimitMotion || !window.matchMedia("(pointer: fine)").matches) return;

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

// Cambia automaticamente las fotos de la panoramica principal.
function initHeroGallery() {
  const slides = Array.from(document.querySelectorAll(SELECTORS.heroSlides));
  const dots = Array.from(document.querySelectorAll(SELECTORS.heroGalleryDots));

  if (slides.length < 2) return;

  let currentIndex = Math.max(slides.findIndex((slide) => slide.classList.contains("is-active")), 0);
  let timer = null;

  const showSlide = (nextIndex) => {
    currentIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  const start = () => {
    if (timer) return;
    timer = window.setInterval(() => {
      showSlide(currentIndex + 1);
    }, 3800);
  };

  const stop = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  showSlide(currentIndex);
  start();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
      return;
    }

    start();
  });
}

// Controla el menu hamburguesa, el fondo oscuro, el cierre con Escape y el estado accesible.
function initMenu() {
  const siteHeader = document.querySelector(SELECTORS.siteHeader);
  const menuToggle = document.querySelector(SELECTORS.menuToggle);
  const navList = document.querySelector(SELECTORS.navList);
  const menuBackdrop = document.querySelector(SELECTORS.menuBackdrop);
  const navLinks = document.querySelectorAll(SELECTORS.navLinks);

  if (!siteHeader || !menuToggle || !navList) return;

  const setMenuState = (isOpen) => {
    navList.classList.toggle("open", isOpen);
    menuToggle.classList.toggle("open", isOpen);
    siteHeader.classList.toggle("menu-is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    if (menuBackdrop) {
      menuBackdrop.hidden = !isOpen;
    }

    siteHeader.classList.remove("is-hidden");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");
  };

  const closeMenu = () => {
    if (navList.classList.contains("open")) {
      setMenuState(false);
    }
  };

  menuToggle.addEventListener("click", () => {
    setMenuState(!navList.classList.contains("open"));
  });

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

  return { siteHeader, menuToggle, navList, closeMenu };
}

// Marca automaticamente el enlace activo del menu segun la seccion visible en pantalla.
function initActiveSection() {
  const navLinks = document.querySelectorAll(SELECTORS.navLinks);
  const sections = document.querySelectorAll(SELECTORS.sections);

  if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const activeId = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
        });
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-18% 0px -58% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// Muestra elementos con clase .reveal y anima contadores cuando entran al viewport.
function initReveal() {
  const revealElements = document.querySelectorAll(SELECTORS.reveal);
  const animatedCounters = new WeakSet();

  const setCounterValue = (counter, value) => {
    counter.textContent = value.toLocaleString("es-CO");
  };

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.counter);
    if (!Number.isFinite(target)) return;

    if (shouldLimitMotion) {
      setCounterValue(counter, target);
      return;
    }

    const duration = 1300;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounterValue(counter, Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCounterValue(counter, target);
      }
    };

    requestAnimationFrame(update);
  };

  const reveal = (element) => {
    element.classList.add("visible");

    element.querySelectorAll("[data-counter]").forEach((counter) => {
      if (animatedCounters.has(counter)) return;
      animatedCounters.add(counter);
      animateCounter(counter);
    });
  };

  revealElements.forEach((element, index) => {
    element.style.setProperty("--delay", `${Math.min(index * 55, 300)}ms`);
  });

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

// Agrupa estados que dependen del scroll: progreso de lectura, header, boton subir y contacto rapido.
function initScrollState(menuApi) {
  const progressBar = document.querySelector(SELECTORS.progressBar);
  const quickContact = document.querySelector(SELECTORS.quickContact);
  const contactSection = document.querySelector(SELECTORS.contactSection);
  const scrollTopButton = document.querySelector(SELECTORS.scrollTopButton);
  const siteHeader = menuApi?.siteHeader;
  const menuToggle = menuApi?.menuToggle;
  const navList = menuApi?.navList;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (quickContact && contactSection) {
      const contactTop = contactSection.getBoundingClientRect().top;
      quickContact.classList.toggle("is-hidden", contactTop < window.innerHeight * 0.65);
    }

    if (scrollTopButton) {
      scrollTopButton.classList.toggle("visible", scrollTop > 200);
    }

    if (siteHeader && menuToggle && navList) {
      const isScrollingDown = scrollTop > lastScrollY;
      const isNearTop = scrollTop < 120;
      const menuIsOpen = navList.classList.contains("open");

      if (isNearTop || !isScrollingDown || menuIsOpen) {
        siteHeader.classList.remove("is-hidden");
      } else {
        siteHeader.classList.add("is-hidden");
        menuApi.closeMenu();
      }
    }

    lastScrollY = Math.max(scrollTop, 0);
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    requestAnimationFrame(update);
    ticking = true;
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  update();

  scrollTopButton?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: shouldLimitMotion ? "auto" : "smooth" });
  });
}

// Valida el formulario antes de abrir WhatsApp con el mensaje armado por el usuario.
function initContactForm() {
  const form = document.querySelector(SELECTORS.form);
  const status = document.querySelector(SELECTORS.formStatus);

  if (!form || !status) return;

  const fields = {
    name: form.elements.name,
    phone: form.elements.phone,
    email: form.elements.email,
    interest: form.elements.interest,
    message: form.elements.message
  };

  const setStatus = (message, color) => {
    status.textContent = message;
    status.style.color = color;
  };

  const setFieldError = (field, message) => {
    const error = document.querySelector(`#${field.id}-error`);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) {
      error.textContent = message;
    }
  };

  const validators = {
    name(value) {
      if (!value) return "Escribe tu nombre completo.";
      if (value.length < 3) return "El nombre debe tener al menos 3 caracteres.";
      if (!/^[\p{L}\s.'-]+$/u.test(value)) return "Usa solo letras y espacios en el nombre.";
      if (value.trim().split(/\s+/).length < 2) return "Incluye nombre y apellido.";
      return "";
    },
    phone(value) {
      const digits = value.replace(/\D/g, "");
      if (!value) return "Escribe un número de teléfono.";
      if (digits.length < 7 || digits.length > 15) return "El teléfono debe tener entre 7 y 15 dígitos.";
      if (/^(\d)\1+$/.test(digits)) return "Ingresa un teléfono válido.";
      return "";
    },
    email(value) {
      if (!value) return "Escribe tu correo electrónico.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Ingresa un correo electrónico válido.";
      return "";
    },
    interest(value) {
      if (!value) return "Selecciona un interés.";
      return "";
    },
    message(value) {
      if (!value) return "Escribe tu mensaje.";
      if (value.length < 20) return "El mensaje debe tener al menos 20 caracteres.";
      if (value.length > 700) return "El mensaje no debe superar los 700 caracteres.";
      return "";
    }
  };

  const getValues = () => ({
    name: fields.name.value.trim(),
    phone: fields.phone.value.trim(),
    email: fields.email.value.trim(),
    interest: fields.interest.value.trim(),
    message: fields.message.value.trim()
  });

  const validateField = (name) => {
    const field = fields[name];
    const value = field.value.trim();
    const error = validators[name](value);
    setFieldError(field, error);
    return !error;
  };

  Object.keys(fields).forEach((name) => {
    const eventName = fields[name].tagName === "SELECT" ? "change" : "input";
    fields[name].addEventListener(eventName, () => {
      if (fields[name].getAttribute("aria-invalid") === "true") {
        validateField(name);
      }
      setStatus("", "");
    });

    fields[name].addEventListener("blur", () => {
      validateField(name);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = Object.keys(fields).map(validateField).every(Boolean);
    const values = getValues();

    if (!isValid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      firstInvalid?.focus();
      setStatus("Revisa los campos marcados antes de enviar.", "#b42318");
      return;
    }

    const interestLabels = {
      programas: "Programas",
      donacion: "Donación",
      voluntariado: "Voluntariado",
      alianza: "Alianza",
      informacion: "Información general"
    };

    const whatsappMessage = [
      "Hola, quiero contactar a la Fundación Amigos Como Arroz.",
      "",
      `Nombre: ${values.name}`,
      `Teléfono: ${values.phone}`,
      `Correo: ${values.email}`,
      `Interés: ${interestLabels[values.interest] || values.interest}`,
      "",
      `Mensaje: ${values.message}`
    ].join("\n");

    const whatsappUrl = `https://wa.me/573187073308?text=${encodeURIComponent(whatsappMessage)}`;

    setStatus("Validación correcta. Te redirigiremos a WhatsApp para completar el envío.", "#5f8f73");
    if (typeof window.gtag === "function") {
      window.gtag("event", "envio_formulario_whatsapp", {
        event_category: "contacto",
        event_label: interestLabels[values.interest] || values.interest
      });
    }
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    form.reset();
    Object.values(fields).forEach((field) => setFieldError(field, ""));
  });
}

// Crea el carrusel del equipo con botones, puntos indicadores, pausa y avance automatico.
function initTeamSlider() {
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

// Carga los videos de YouTube solo cuando el usuario hace clic para mejorar rendimiento inicial.
function initLazyVideos() {
  document.querySelectorAll(SELECTORS.lazyVideo).forEach((button) => {
    button.addEventListener("click", () => {
      const videoId = button.dataset.videoId;
      if (!videoId) return;

      const iframe = document.createElement("iframe");
      iframe.title = button.dataset.title || "Video";
      iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1`;
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";

      button.replaceWith(iframe);
    });
  });
}

// Chatbot basico con respuestas frecuentes de la fundacion.
function initChatbot() {
  const toggle = document.querySelector(SELECTORS.chatbotToggle);
  const panel = document.querySelector(SELECTORS.chatbotPanel);
  const close = document.querySelector(SELECTORS.chatbotClose);
  const messages = document.querySelector(SELECTORS.chatbotMessages);
  const form = document.querySelector(SELECTORS.chatbotForm);
  const input = document.querySelector(SELECTORS.chatbotInput);
  const quickButtons = document.querySelectorAll(SELECTORS.chatbotQuick);

  if (!toggle || !panel || !messages || !form || !input) return;

  const normalize = (text) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const answers = {
    phone:
      'Puedes comunicarte con la fundación al WhatsApp <a href="https://wa.me/573187073308" target="_blank" rel="noopener noreferrer">318 707 3308</a>.',
    location:
      "Estamos ubicados en la Carrera 7A No. 16-25, barrio Quirinal, Neiva, Huila.",
    programs:
      "Nuestros programas principales son Semilla, Siembra, Cosecha y Acompañamiento Psicosocial.",
    support:
      'Puedes apoyar como voluntario, aliado o donante. Escríbenos por WhatsApp al <a href="https://wa.me/573187073308?text=Hola%2C%20quiero%20apoyar%20a%20la%20Fundaci%C3%B3n%20Amigos%20Como%20Arroz." target="_blank" rel="noopener noreferrer">318 707 3308</a>.',
    default:
      'Puedo ayudarte con teléfono, WhatsApp, ubicación, programas o formas de apoyo. Si necesitas atención directa, escríbenos al <a href="https://wa.me/573187073308" target="_blank" rel="noopener noreferrer">318 707 3308</a>.'
  };

  const getAnswer = (question) => {
    const text = normalize(question);

    if (/(telefono|celular|whatsapp|contacto|comunicar|llamar|numero)/.test(text)) {
      return answers.phone;
    }

    if (/(ubicacion|direccion|donde|carrera|quirinal|neiva|barrio)/.test(text)) {
      return answers.location;
    }

    if (/(programa|semilla|siembra|cosecha|psicosocial|actividad)/.test(text)) {
      return answers.programs;
    }

    if (/(apoyar|donar|donacion|voluntario|aliado|ayudar)/.test(text)) {
      return answers.support;
    }

    return answers.default;
  };

  const appendMessage = (content, type) => {
    const message = document.createElement("div");
    message.className = `chatbot-message chatbot-message--${type}`;

    if (type === "bot") {
      message.innerHTML = content;
    } else {
      message.textContent = content;
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  };

  const setOpen = (isOpen) => {
    panel.hidden = !isOpen;
    toggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      setTimeout(() => input.focus(), 80);
    }
  };

  const ask = (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    appendMessage(cleanQuestion, "user");
    appendMessage(getAnswer(cleanQuestion), "bot");
  };

  toggle.addEventListener("click", () => {
    setOpen(panel.hidden);
  });

  close?.addEventListener("click", () => {
    setOpen(false);
  });

  quickButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setOpen(true);
      ask(button.dataset.chatQuestion || button.textContent);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
    input.value = "";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      setOpen(false);
    }
  });
}

// Actualiza pequenos datos dinamicos, como el ano del footer.
function initMeta() {
  const currentYear = document.querySelector(SELECTORS.currentYear);
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
}

// Inicializacion general del sitio.
const menuApi = initMenu();
initMeta();
initHero();
initHeroGallery();
initActiveSection();
initReveal();
initScrollState(menuApi);
initContactForm();
initTeamSlider();
initLazyVideos();
initChatbot();
