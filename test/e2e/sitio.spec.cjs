// Pruebas en el navegador del sitio compilado. _site/ en el puerto 8180 y _site-ejemplo/ (datos de ejemplo) en 8181.
const { test, expect } = require("@playwright/test");
const { readFileSync } = require("node:fs");

const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const EJEMPLO = "http://localhost:8181/";
const PAGINAS = [
  "index.html",
  "programas/",
  "programas/semilla.html",
  "programas/siembra.html",
  "programas/cosecha.html",
  "programas/psicosocial.html",
  "sede-espinal/",
  "donar.html",
  "voluntariado.html",
  "aliados.html",
  "transparencia.html",
  "privacidad.html",
  "terminos.html",
  "404.html"
];

// Abre la página y espera a que el JS haya arrancado (html[data-listo]).
async function ir(page, url) {
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector("html[data-listo]", { state: "attached" });
}

// Sin pantalla de entrada (ya «vista» en la sesión) y sin decoración navideña, para pruebas estables.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem("entrada", "1"));
});

async function revisarPagina(page, url) {
  const errores = [];
  const fallos = [];
  page.on("pageerror", (e) => errores.push(e.message));
  page.on("console", (m) => m.type() === "error" && !/404/.test(m.text()) && errores.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && !r.url().endsWith("/404.html") && !r.url().includes("404") && fallos.push(`${r.status()} ${r.url()}`));
  await ir(page, url);
  // Espera a fuentes y fotos: si axe mide antes de que se pinte la foto de fondo, ve texto claro sobre fondo claro.
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter((i) => !i.complete && i.loading !== "lazy").map((i) => new Promise((r) => (i.onload = i.onerror = r))));
  });
  await page.waitForTimeout(800);
  // La entrada del inicio (GSAP) termina después de 1,2 s; en máquinas lentas axe medía los botones a medio aparecer.
  await page.waitForFunction(() => [...document.querySelectorAll(".hero-actions")].every((e) => getComputedStyle(e).opacity === "1"), null, { timeout: 10000 });
  const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  // El contraste se mide sobre el estado final: sin transiciones a medio camino (con varias pruebas en paralelo,
  // WebKit a veces medía un texto todavía semitransparente).
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  await page.addScriptTag({ content: AXE });
  const graves = await page.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ["violations"] });
    return r.violations.filter((v) => ["serious", "critical"].includes(v.impact)).map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`);
  });
  expect(errores, "errores de consola").toEqual([]);
  expect(fallos, "respuestas 4xx o 5xx").toEqual([]);
  expect(desborde, "desborde horizontal").toBeLessThanOrEqual(0);
  expect(graves, "axe: errores serios o críticos").toEqual([]);
}

for (const pagina of PAGINAS) {
  test(`carga limpia: ${pagina}`, async ({ page }) => {
    await revisarPagina(page, `${pagina}${pagina.includes("?") ? "&" : "?"}temporada=off`);
  });
  test(`carga limpia con datos de ejemplo: ${pagina}`, async ({ page }) => {
    await revisarPagina(page, `${EJEMPLO}${pagina}?temporada=off`);
  });
}

test("menú: abre, guarda el foco y cierra con Escape", async ({ page, isMobile }, info) => {
  test.skip(info.project.use.viewport.width > 1000, "en escritorio los enlaces están en la barra");
  await ir(page, "index.html?temporada=off");
  const boton = page.locator(".menu-toggle");
  await boton.click();
  await expect(boton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#nav-list")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(boton).toHaveAttribute("aria-expanded", "false");
  await expect(boton).toBeFocused();
});

test("formulario: errores, autorización y mensaje de WhatsApp", async ({ page }) => {
  await ir(page, "index.html?temporada=off");
  await page.evaluate(() => {
    window.__abierto = null;
    window.open = (url) => {
      window.__abierto = url;
      return null;
    };
  });
  const form = page.locator("#contact-form");
  await form.locator('button[type="submit"]').click();
  await expect(page.locator("#form-resumen")).toBeVisible();
  await expect(page.locator("#form-resumen")).toBeFocused();
  await expect(page.locator("#autorizo-error")).toContainText("autoriza");
  await page.fill("#name", "Ana María Pérez");
  await page.selectOption("#interest", "programas");
  await expect(page.locator("#aviso-menor")).toBeVisible();
  await page.fill("#message", "Quiero inscribir a mi hija en Semilla.");
  await form.locator('button[type="submit"]').click();
  expect(await page.evaluate(() => window.__abierto), "sin autorización no abre WhatsApp").toBeNull();
  await page.check("#autorizo");
  await form.locator('button[type="submit"]').click();
  const url = await page.evaluate(() => window.__abierto);
  expect(url).toContain("https://wa.me/");
  const mensaje = decodeURIComponent(new URL(url).searchParams.get("text"));
  expect(mensaje).toContain("Nombre: Ana María Pérez");
  expect(mensaje).toContain("Interés: Inscripción a un programa");
  expect(mensaje).not.toContain("Teléfono:");
});

test("chat: respuestas fijas sin la API", async ({ page }) => {
  await ir(page, "index.html?temporada=off");
  await page.click("#chatbotToggle");
  await page.click('[data-chat-question="programas"]');
  await expect(page.locator(".chatbot-message--bot").last()).toContainText("Semilla, Siembra, Cosecha");
  await page.click('[data-chat-question="ubicacion"]');
  await expect(page.locator(".chatbot-message--bot").last()).toContainText("Carrera 7A");
  await expect(page.locator(".chatbot-privacidad")).toContainText("servicio de IA");
});

test("cookies: sin aceptar no se carga Google Analytics", async ({ page }) => {
  const google = [];
  page.on("request", (r) => /googletagmanager|google-analytics/.test(r.url()) && google.push(r.url()));
  await page.route(/googletagmanager|google-analytics/, (r) => r.abort());
  await ir(page, `${EJEMPLO}index.html?temporada=off`);
  await expect(page.locator(".aviso-cookies")).toBeVisible();
  await page.waitForTimeout(500);
  expect(google).toEqual([]);
  await page.click('[data-cookies="rechazar"]');
  await expect(page.locator(".aviso-cookies")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".aviso-cookies")).toHaveCount(0);
  expect(google).toEqual([]);
  // Sin ID de analítica (sitio real hoy) no hay aviso.
  await ir(page, "index.html?temporada=off");
  await expect(page.locator(".aviso-cookies")).toHaveCount(0);
});

test("donar: copiar el medio de pago lo anuncia", async ({ page, context, browserName }) => {
  if (browserName === "chromium") await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await ir(page, `${EJEMPLO}donar.html?temporada=off`);
  await page.locator("[data-copiar]").first().click();
  await expect(page.locator("[data-copiar-estado]")).toContainText("000-000000-00");
});

test("carruseles: se mueven con las flechas y anuncian la posición", async ({ page }) => {
  await ir(page, "index.html?temporada=off");
  const carrusel = page.locator(".extracurricular-carousel");
  await carrusel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".extracurricular-carousel + .carrusel-controles [role=status]")).toContainText("2 de");
  await expect(carrusel).toHaveAttribute("aria-roledescription", "carrusel");
});

test("videos: se cargan al pulsar el póster", async ({ page }) => {
  await ir(page, "index.html?temporada=off");
  const boton = page.locator(".local-video-loader").first();
  await boton.scrollIntoViewIfNeeded();
  await boton.dispatchEvent("click"); // en celular la barra fija puede tapar el póster en la posición de la prueba
  const video = page.locator(".testimonial-video-carousel video").first();
  await expect(video).toHaveAttribute("controls", "");
  await expect(video.locator("source")).toHaveAttribute("src", /\.mp4$/);
});

test("datos vacíos no dejan secciones vacías; con ejemplo aparecen", async ({ page }) => {
  await ir(page, "index.html?temporada=off");
  await expect(page.locator(".faq, .convocatorias, #quienes-somos, .franja-aliados, .metrics-fuente")).toHaveCount(0);
  await ir(page, `${EJEMPLO}index.html?temporada=off`);
  for (const selector of [".faq", ".convocatorias", "#quienes-somos", ".franja-aliados", ".metrics-fuente"]) {
    await expect(page.locator(selector).first(), selector).toBeAttached();
  }
});
