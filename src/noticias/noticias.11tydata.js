// Datos comunes de las noticias (src/noticias/*.md): plantilla, colección y URL noticias/<archivo>.html.
// En cada noticia van: title, description, date (AAAA-MM-DD), imagen (opcional) y alt (opcional).
// El listado (index.njk) solo se publica si existe al menos una noticia .md.
const { readdirSync } = require("node:fs");
const hayNoticias = readdirSync(__dirname).some((f) => f.endsWith(".md"));

module.exports = {
  layout: "layouts/noticia.njk",
  tags: ["noticias"],
  eleventyComputed: {
    canonical: (data) => (data.page.inputPath.endsWith(".md") ? `/noticias/${data.page.fileSlug}.html` : data.canonical),
    nombre: (data) => (data.page.inputPath.endsWith(".md") ? data.title : data.nombre),
    permalink: (data) => {
      if (data.page.inputPath.endsWith(".md")) return `noticias/${data.page.fileSlug}.html`;
      return hayNoticias ? "noticias/index.html" : false;
    }
  }
};
