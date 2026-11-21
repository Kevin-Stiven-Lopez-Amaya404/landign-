// npm run build:ejemplo: compila el sitio en _site-ejemplo/ con datos de ejemplo, para revisar cómo se ven las
// secciones que hoy están ocultas por falta de datos (donaciones, FAQ, aliados, cookies…).
// Mezcla src/_data/site.json con src/_data/site.ejemplo.json (este archivo está en .gitignore: nunca va a Git).
// Si no existe site.ejemplo.json, usa test/fixtures/site.ejemplo.json (datos ficticios de prueba marcados como EJEMPLO; nunca se publican).
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const mezclar = (base, extra) => {
  if (Array.isArray(extra) || typeof extra !== "object" || extra === null) return extra;
  const salida = { ...base };
  for (const [clave, valor] of Object.entries(extra)) salida[clave] = mezclar(base?.[clave], valor);
  return salida;
};

const archivoEjemplo = existsSync("src/_data/site.ejemplo.json") ? "src/_data/site.ejemplo.json" : "test/fixtures/site.ejemplo.json";
const site = mezclar(JSON.parse(readFileSync("src/_data/site.json", "utf8")), JSON.parse(readFileSync(archivoEjemplo, "utf8")));

const datos = ".cache-ejemplo/_data";
rmSync(".cache-ejemplo", { recursive: true, force: true });
rmSync("_site-ejemplo", { recursive: true, force: true });
mkdirSync(datos, { recursive: true });
cpSync("src/_data", datos, { recursive: true, filter: (f) => !f.endsWith("site.ejemplo.json") });
writeFileSync(`${datos}/site.json`, JSON.stringify(site, null, 2));

execFileSync(process.execPath, ["node_modules/@11ty/eleventy/cmd.cjs", "--output=_site-ejemplo"], {
  stdio: "inherit",
  env: { ...process.env, SITIO_DATOS: datos }
});
console.log(`Listo: _site-ejemplo/ con datos de ${archivoEjemplo}`);
