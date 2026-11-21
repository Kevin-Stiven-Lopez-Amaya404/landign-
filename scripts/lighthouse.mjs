// npm run lighthouse [-- --url=http://localhost:8180/] [-- --veces=3] [-- --aviso]: Lighthouse móvil en las
// páginas clave, con la mediana de varias corridas (los tiempos varían mucho de una a otra).
// Umbrales (Fase 7 de HU26): rendimiento ≥ 90, accesibilidad, buenas prácticas y SEO = 100, LCP < 2,5 s,
// CLS < 0,05 y TBT < 200 ms. Con --aviso solo informa (no falla): así corre en los PR.
// Necesita Chrome o Chromium (CHROME_PATH) y descarga Lighthouse con npx la primera vez.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const opcion = (nombre, porDefecto) => process.argv.find((a) => a.startsWith(`--${nombre}=`))?.split("=")[1] ?? porDefecto;
const BASE = opcion("url", "http://localhost:8180/");
const VECES = Number(opcion("veces", "3"));
const SOLO_AVISO = process.argv.includes("--aviso");
const PAGINAS = ["index.html", "programas/semilla.html", "programas/siembra.html", "programas/cosecha.html", "programas/psicosocial.html", "sede-espinal/", "donar.html"];
const UMBRALES = { rendimiento: 90, accesibilidad: 100, practicas: 100, seo: 100, lcp: 2500, cls: 0.05, tbt: 200 };

const carpeta = mkdtempSync(join(tmpdir(), "lighthouse-"));
const mediana = (v) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];
let fallas = 0;

for (const pagina of PAGINAS) {
  const corridas = [];
  for (let i = 0; i < VECES; i++) {
    const salida = join(carpeta, `r-${i}.json`);
    execFileSync(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["--yes", "lighthouse@12.8.2", BASE + pagina, "--quiet", "--output=json", `--output-path=${salida}`, "--chrome-flags=--headless=new --no-sandbox", "--only-categories=performance,accessibility,best-practices,seo"],
      { stdio: "ignore", shell: process.platform === "win32" }
    );
    const { categories: c, audits: a } = JSON.parse(readFileSync(salida, "utf8"));
    corridas.push({
      rendimiento: c.performance.score * 100,
      accesibilidad: c.accessibility.score * 100,
      practicas: c["best-practices"].score * 100,
      seo: c.seo.score * 100,
      lcp: a["largest-contentful-paint"].numericValue,
      cls: a["cumulative-layout-shift"].numericValue,
      tbt: a["total-blocking-time"].numericValue
    });
  }
  const m = Object.fromEntries(Object.keys(UMBRALES).map((k) => [k, mediana(corridas.map((c) => c[k]))]));
  const malos = Object.entries(UMBRALES).filter(([k, u]) => (["lcp", "cls", "tbt"].includes(k) ? m[k] > u : m[k] < u)).map(([k]) => k);
  fallas += malos.length;
  console.log(
    `${malos.length ? "✗" : "✓"} ${pagina.padEnd(28)} rendimiento ${Math.round(m.rendimiento)} · a11y ${Math.round(m.accesibilidad)} · prácticas ${Math.round(m.practicas)} · SEO ${Math.round(m.seo)} · LCP ${(m.lcp / 1000).toFixed(1)} s · CLS ${m.cls.toFixed(3)} · TBT ${Math.round(m.tbt)} ms${malos.length ? `  (bajo el umbral: ${malos.join(", ")})` : ""}`
  );
}
if (fallas && !SOLO_AVISO) process.exit(1);
