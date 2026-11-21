// npm run test:e2e: pruebas en el navegador sobre el sitio compilado (_site/) y el de ejemplo (_site-ejemplo/).
// Antes: npm run build y npm run build:ejemplo. En CI solo corre Chromium (ver .github/workflows/ci.yml).
// CommonJS a propósito: con Node 24, Playwright 1.49 se queda cargando las pruebas escritas como ES modules.
const { defineConfig, devices } = require("@playwright/test");
// CHROMIUM_PATH (opcional): usar un Chromium ya instalado en vez del que descarga «npx playwright install».
const chromiumPropio = process.env.CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.CHROMIUM_PATH } } : {};

const anchos = [
  { nombre: "390", viewport: { width: 390, height: 844 } },
  { nombre: "1440", viewport: { width: 1440, height: 900 } }
];
const navegadores = [
  { nombre: "chromium", dispositivo: devices["Desktop Chrome"] },
  { nombre: "firefox", dispositivo: devices["Desktop Firefox"] },
  { nombre: "webkit", dispositivo: devices["Desktop Safari"] }
];

module.exports = defineConfig({
  testDir: "test/e2e",
  timeout: 60_000,
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: { baseURL: "http://localhost:8180/", reducedMotion: "reduce" },
  projects: navegadores.flatMap((n) =>
    anchos.map((a) => ({ name: `${n.nombre}-${a.nombre}`, use: { ...n.dispositivo, viewport: a.viewport, ...(n.nombre === "chromium" ? chromiumPropio : {}) } }))
  ),
  webServer: [
    { command: "node scripts/servir.mjs _site 8180", port: 8180, reuseExistingServer: !process.env.CI },
    { command: "node scripts/servir.mjs _site-ejemplo 8181", port: 8181, reuseExistingServer: !process.env.CI }
  ]
});
