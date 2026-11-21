// Eleventy compila src/ en _site/. Después, scripts/empaquetar.mjs empaqueta y minifica el JS y el CSS
// (esbuild) dentro de _site/. Solo se publican los recursos que el sitio usa (ver RECURSOS).
import { readFileSync, statSync } from "node:fs";

import {
  whatsapp as armarWhatsapp,
  raiz,
  hayDonacion,
  migasLd,
  ngoLd,
  lugarLd,
  peso,
  faqDe,
  faqLd,
  convocatoriasAbiertas,
  fechaLarga,
  programaLd,
  indexable,
  minificarHtml,
  avisarPestanaNueva,
  MENSAJE_DONAR
} from "./lib/sitio.mjs";
import { empaquetar, huella } from "./scripts/empaquetar.mjs";

// SITIO_DATOS: carpeta de datos alternativa (solo la usa npm run build:ejemplo; ver scripts/ejemplo.mjs).
const DATOS = process.env.SITIO_DATOS || "src/_data";
const site = JSON.parse(readFileSync(`${DATOS}/site.json`, "utf8"));
const whatsapp = (texto) => armarWhatsapp(site.whatsapp, texto);

// Lo que se copia tal cual a _site/. Los originales de las fotos (assets/semilla, siembra, cosecha, psicologia,
// img/hero, img/content, img/team) y de los videos (assets/videos/originales) se quedan en el repositorio
// pero no se publican. El JS y el CSS los escribe empaquetar.mjs.
const RECURSOS = [
  ".nojekyll",
  "assets/img/opt",
  "assets/img/iconos",
  "assets/img/compartir",
  "assets/fonts",
  "assets/videos/*.mp4",
  "assets/videos/subtitulos/*.vtt",
  "informes/*.pdf",
  "robots.txt",
  "site.webmanifest",
  "favicon.ico"
];

export default function (eleventyConfig) {
  for (const ruta of RECURSOS) eleventyConfig.addPassthroughCopy(ruta);

  // Los README de las carpetas son documentación, no páginas.
  eleventyConfig.ignores.add("src/**/README.md");

  // JS y CSS empaquetados y minificados al terminar cada compilación.
  // (directories.output respeta --output, que usa npm run build:ejemplo; dir.output no.)
  eleventyConfig.on("eleventy.after", ({ directories, dir }) => empaquetar(directories?.output ?? dir.output));

  // HTML: aviso oculto en los enlaces que abren otra pestaña, y sin comentarios ni sangría (minificación
  // conservadora: no toca el contenido de las etiquetas).
  eleventyConfig.addTransform("html", (contenido, ruta) =>
    typeof ruta === "string" && ruta.endsWith(".html") ? minificarHtml(avisarPestanaNueva(contenido)) : contenido
  );

  // lastmod del sitemap: la fecha del último commit de cada archivo (las noticias usan su propia fecha).
  eleventyConfig.addGlobalData("date", "git Last Modified");

  // Mantener las URL actuales (programas/cosecha.html, no programas/cosecha/).
  eleventyConfig.addGlobalData("permalink", "{{ page.filePathStem }}.html");

  // Donar: si hay al menos un medio de pago o una pasarela en site.json, los botones llevan a donar.html;
  // si no, abren WhatsApp como siempre. La condición vive solo aquí.
  eleventyConfig.addGlobalData("donar", { pagina: hayDonacion(site) });
  // "production" en la publicación de Vercel; "preview" en las vistas previas; "local" en tu computador.
  eleventyConfig.addGlobalData("entorno", process.env.VERCEL_ENV || "local");

  // <a {% donarAtributos raiz %} …>: href (y target/rel cuando es WhatsApp).
  eleventyConfig.addShortcode("donarAtributos", (prefijo = "", mensaje = MENSAJE_DONAR) =>
    hayDonacion(site) ? `href="${prefijo}donar.html"` : `href="${whatsapp(mensaje)}" target="_blank" rel="noopener noreferrer"`
  );

  // {{ "assets/css/sitio.css" | huella }} → huella corta del contenido (para ?v=…); "js" → huella de todo assets/js.
  eleventyConfig.addFilter("huella", huella);

  // {{ 4200 | numero }} → «4.200» (formato de Colombia).
  eleventyConfig.addFilter("numero", (n) => Number(n).toLocaleString("es-CO"));
  // {{ "Hola, quiero…" | whatsapp }} → enlace a WhatsApp con el mensaje ya codificado.
  eleventyConfig.addFilter("whatsapp", whatsapp);
  // {{ page.url | raiz }} → prefijo relativo hasta la raíz del sitio ("" en la raíz, "../" en programas/…).
  eleventyConfig.addFilter("raiz", raiz);
  // {{ "2027-03-15" | fechaLarga }} → «15 de marzo de 2027».
  eleventyConfig.addFilter("fechaLarga", fechaLarga);
  // {{ "informes/archivo.pdf" | peso }} → «18,6 MB» (tamaño real del archivo al compilar; vacío si no existe).
  eleventyConfig.addFilter("peso", (ruta) => {
    try {
      return peso(statSync(ruta).size);
    } catch {
      return "";
    }
  });
  // {{ datos | json }} → JSON seguro dentro de <script> (un "</script>" en un dato no puede cerrar la etiqueta).
  eleventyConfig.addFilter("json", (valor) => JSON.stringify(valor).replace(/</g, "\\u003c"));

  // Datos que se muestran solo si existen.
  eleventyConfig.addFilter("faqDe", faqDe);
  eleventyConfig.addFilter("convocatoriasAbiertas", (lista, hoy, programa) => convocatoriasAbiertas(lista, hoy, programa));

  // JSON-LD y sitemap.
  eleventyConfig.addFilter("migasLd", (migas, nombre, canonical) => migasLd(site.url, migas, nombre, canonical));
  eleventyConfig.addFilter("ngoLd", ngoLd);
  eleventyConfig.addFilter("lugarLd", lugarLd);
  eleventyConfig.addFilter("faqLd", faqLd);
  eleventyConfig.addFilter("programaLd", (datos, pagina, descripcion) => programaLd(datos, pagina, descripcion));
  eleventyConfig.addFilter("esIndexable", indexable);
  // Páginas del sitemap: las que se publican y se indexan (sin la 404 ni las que llevan noindex).
  eleventyConfig.addFilter("paraSitemap", (paginas) => paginas.filter((p) => p.url && p.outputPath?.endsWith(".html") && indexable(p.data)));

  return {
    dir: { input: "src", output: "_site", data: process.env.SITIO_DATOS ? `../${process.env.SITIO_DATOS}` : "_data" },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk"
  };
}
