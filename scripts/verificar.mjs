// npm run check (después de npm run build): revisa el sitio compilado en _site/.
// 1. Cada src, href, srcset, póster, video y subtítulo de cada página apunta a un archivo que existe.
// 2. Cada url() de los CSS apunta a un archivo que existe.
// 3. Cada bloque JSON-LD es JSON válido y tiene @context y @type (más los campos clave de cada tipo).
// 4. Cada URL del sitemap existe y ninguna página noindex está en él.
// 5. No quedan «Lorem», «TODO», «G-XXXX» ni «EJEMPLO» visibles en _site/.
// Sale con código 1 si encuentra algo, con la lista de problemas.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, posix } from "node:path";

// Uso: node scripts/verificar.mjs [carpeta] [--ejemplo]. Con --ejemplo (salida de npm run build:ejemplo) no marca «EJEMPLO».
const argumentos = process.argv.slice(2);
const SALIDA = argumentos.find((a) => !a.startsWith("--")) || "_site";
const conEjemplo = argumentos.includes("--ejemplo");
const DOMINIO = "https://fundacionamigoscomoarroz.com";
const problemas = [];

const archivos = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? archivos(join(dir, f)) : [join(dir, f)]));
const todos = archivos(SALIDA).map((f) => f.split("\\").join("/"));
const paginas = todos.filter((f) => f.endsWith(".html"));

// Resuelve una referencia de la página a un archivo dentro de _site (null si es externa o un ancla).
function resolver(pagina, ref) {
  if (!ref || /^(https?:|mailto:|tel:|data:|#|javascript:)/.test(ref) && !ref.startsWith(DOMINIO)) return null;
  let ruta = ref.startsWith(DOMINIO) ? ref.slice(DOMINIO.length) || "/" : ref;
  ruta = ruta.split("#")[0].split("?")[0];
  if (!ruta) return null;
  const base = ruta.startsWith("/") ? SALIDA + ruta : posix.join(dirname(pagina), ruta);
  let destino = posix.normalize(decodeURI(base));
  if (destino.endsWith("/") || (existsSync(destino) && statSync(destino).isDirectory())) destino = posix.join(destino, "index.html");
  return destino;
}

const REQUERIDOS = {
  NGO: ["name", "url"],
  BreadcrumbList: ["itemListElement"],
  Service: ["name", "provider"],
  Place: ["name", "address"],
  FAQPage: ["mainEntity"],
  DonateAction: ["recipient"],
  NewsArticle: ["headline", "datePublished"]
};

for (const pagina of paginas) {
  const html = readFileSync(pagina, "utf8");
  const nombre = pagina.slice(SALIDA.length + 1);

  // 1. Referencias
  const refs = [];
  for (const m of html.matchAll(/\s(?:src|href|poster|data-video-src|data-poster|data-captions)="([^"]*)"/g)) refs.push(m[1]);
  for (const m of html.matchAll(/\s(?:srcset|imagesrcset)="([^"]*)"/g)) for (const parte of m[1].split(",")) refs.push(parte.trim().split(/\s+/)[0]);
  for (const ref of refs) {
    if (ref.includes("{{") || ref.includes("{%")) problemas.push(`${nombre}: plantilla sin resolver en «${ref}»`);
    const destino = resolver(pagina, ref);
    if (destino && !existsSync(destino)) problemas.push(`${nombre}: no existe «${ref}»`);
  }

  // 3. JSON-LD
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let datos;
    try {
      datos = JSON.parse(m[1]);
    } catch (e) {
      problemas.push(`${nombre}: JSON-LD inválido (${e.message})`);
      continue;
    }
    if (datos === null) {
      problemas.push(`${nombre}: JSON-LD vacío (null)`);
      continue;
    }
    if (!datos["@context"] || !datos["@type"]) problemas.push(`${nombre}: JSON-LD sin @context o @type`);
    for (const campo of REQUERIDOS[datos["@type"]] || []) {
      if (datos[campo] === undefined || datos[campo] === "" || (Array.isArray(datos[campo]) && !datos[campo].length)) problemas.push(`${nombre}: JSON-LD ${datos["@type"]} sin «${campo}»`);
    }
  }

  // 5. Restos de relleno en el texto visible
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
  for (const marca of [/lorem ipsum/i, /\bTODO\b/, /G-X{4,}/, ...(conEjemplo ? [] : [/\bEJEMPLO\b/])]) {
    if (marca.test(visible)) problemas.push(`${nombre}: texto de relleno visible (${marca})`);
  }
}

// 2. url() de los CSS
for (const css of todos.filter((f) => f.endsWith(".css"))) {
  for (const m of readFileSync(css, "utf8").matchAll(/url\(([^)]+)\)/g)) {
    const ref = m[1].replace(/["']/g, "");
    if (ref.startsWith("data:") || ref.startsWith("#")) continue;
    const destino = posix.normalize(posix.join(dirname(css), ref.split("?")[0]));
    if (!existsSync(destino)) problemas.push(`${css}: no existe «${ref}»`);
  }
}

// 4. Sitemap
const sitemap = join(SALIDA, "sitemap.xml");
if (!existsSync(sitemap)) problemas.push("Falta sitemap.xml");
else {
  for (const [, loc] of readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const destino = resolver(`${SALIDA}/index.html`, loc);
    if (!destino || !existsSync(destino)) {
      problemas.push(`sitemap: no existe ${loc}`);
      continue;
    }
    if (/name="robots" content="noindex/.test(readFileSync(destino, "utf8"))) problemas.push(`sitemap: incluye una página noindex (${loc})`);
  }
}

if (problemas.length) {
  console.error(`✗ ${problemas.length} problema(s):\n` + problemas.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`✓ ${paginas.length} páginas revisadas: referencias, JSON-LD, sitemap y textos sin problemas.`);
