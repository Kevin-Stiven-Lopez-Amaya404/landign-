// Empaqueta y minifica el JS y el CSS del sitio con esbuild dentro de la carpeta de salida (_site/).
// - main.js e interna.js: un archivo cada uno con sus módulos; lo que se importa de forma diferida
//   (animaciones.js con GSAP) queda en assets/js/chunks/ con huella en el nombre.
// - arranque.js y seasonal.js son scripts clásicos del <head>: solo se minifican.
// - El CSS se minifica conservando @layer, color-mix() y las rutas de las fuentes.
// La huella (?v=…) de cada archivo la calcula el filtro huella al compilar las páginas.
import { buildSync } from "esbuild";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OBJETIVO = ["es2020", "chrome90", "safari14", "firefox90"];

export function empaquetar(salida = "_site") {
  buildSync({
    entryPoints: ["assets/js/main.js", "assets/js/interna.js"],
    outdir: `${salida}/assets/js`,
    bundle: true,
    splitting: true,
    format: "esm",
    minify: true,
    target: OBJETIVO,
    entryNames: "[name]",
    chunkNames: "chunks/[name]-[hash]",
    legalComments: "none",
    logLevel: "warning"
  });
  buildSync({
    entryPoints: ["assets/js/arranque.js", "assets/js/seasonal.js"],
    outdir: `${salida}/assets/js`,
    minify: true,
    target: OBJETIVO,
    logLevel: "warning"
  });
  buildSync({
    entryPoints: ["assets/css/sitio.css", "assets/css/seasonal/navidad.css"],
    outbase: "assets/css",
    outdir: `${salida}/assets/css`,
    minify: true,
    // Sin «target» para que esbuild no reescriba color-mix() ni las capas.
    logLevel: "warning"
  });
}

const archivosDe = (ruta) =>
  statSync(ruta).isDirectory() ? readdirSync(ruta).sort().flatMap((f) => archivosDe(join(ruta, f))) : [ruta];

const cache = new Map();
// Huella corta del contenido: "assets/css/sitio.css" → "3f9a1c0b2e"; "js" → huella de todo assets/js.
export function huella(ruta) {
  const clave = ruta === "js" ? "assets/js" : ruta;
  if (!cache.has(clave) || process.env.ELEVENTY_RUN_MODE === "serve") {
    const hash = createHash("sha256");
    for (const archivo of archivosDe(clave)) hash.update(readFileSync(archivo));
    cache.set(clave, hash.digest("hex").slice(0, 10));
  }
  return cache.get(clave);
}
