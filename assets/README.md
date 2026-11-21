# Assets

Recursos estaticos del sitio.

## Carpetas

- `css/`: `sitio.css` (todo el estilo, en capas) y `seasonal/` (temporadas).
- `fonts/`: Unbounded (títulos grandes), Schibsted Grotesk (texto) y Space Mono (etiquetas), servidas desde el sitio.
- `js/`: `main.js` (portada) e `interna.js` (demás páginas) arrancan los módulos de `js/modules/`; esbuild los empaqueta al compilar. `seasonal.js` y `arranque.js` van aparte en el `<head>`.
- `img/`: imagenes optimizadas organizadas por uso.

## Regla

No guardar aqui documentos de contenido ni paginas HTML. Las paginas viven en `src/`. Eleventy copia esta carpeta tal cual al sitio publicado.

