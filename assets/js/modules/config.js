// Datos y ajustes compartidos por los módulos.

// Datos de site.json que usa el JS (Eleventy los escribe en <script id="site-data">): contacto, analítica y chat.
const siteData = JSON.parse(document.getElementById("site-data")?.textContent || "{}");
export const SITE_DATA = siteData;
export const CONTACT = {
  whatsapp: siteData.whatsapp,
  whatsappLabel: siteData.whatsappLabel
};
export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsapp}`;

// Clases e ids que usa el JavaScript.
export const SELECTORS = {
  siteHeader: "#site-header",
  menuToggle: ".menu-toggle",
  navList: "#nav-list",
  menuBackdrop: "#menu-backdrop",
  navLinks: ".nav-link",
  sections: "main section[id]",
  reveal: ".reveal",
  form: "#contact-form",
  formStatus: "#form-status",
  teamSlider: "#teamSlider",
  teamPrev: "#teamPrev",
  teamNext: "#teamNext",
  teamDots: "#teamDots",
  localVideoLoader: ".local-video-loader",
  storyBook: "[data-story-book]",
  storyPage: "[data-story-page]",
  storyPrev: "[data-story-prev]",
  storyNext: "[data-story-next]",
  storyStatus: "[data-story-status]",
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
// Solo la preferencia de la persona: para efectos baratos que también valen en celular (contadores).
export const prefersLessMotion = prefersReducedMotion || prefersReducedData;
export const shouldLimitMotion = prefersReducedMotion || prefersReducedData || isSmallViewport || isLikelyLowMemory;
