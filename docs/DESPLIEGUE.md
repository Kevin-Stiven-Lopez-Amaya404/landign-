# Checklist de despliegue

Usa esta lista antes de publicar la pagina.

## Antes de subir

- Reemplazar `G-XXXXXXXXXX` en `assets/js/analytics.js` por el ID real de Google Analytics 4.
- Confirmar que telefono, correo, Instagram y Facebook sean oficiales.
- Confirmar cifras de impacto: participantes, voluntarios, aliados, proyectos y permanencia.
- Confirmar nombres, roles y fotos del equipo.
- Confirmar que los dos videos de YouTube sean los videos que quieres mostrar.
- Revisar la pagina en computador y celular.

## Archivos importantes

- `index.html`: pagina principal.
- `programas/`: paginas internas de programas.
- `assets/css/styles.css`: estilos.
- `assets/js/main.js`: interacciones.
- `assets/js/analytics.js`: conteo de visitas y eventos.
- `robots.txt`: permisos para buscadores.
- `sitemap.xml`: mapa del sitio para buscadores.
- `site.webmanifest`: datos basicos de instalacion/icono.

## Publicacion

Como es un sitio estatico, no necesita servidor propio ni base de datos.

Puedes subirlo a:

- GitHub Pages.
- Netlify.
- Vercel.
- Hosting tradicional con carpeta `public_html`.

La raiz publicada debe contener `index.html`, `assets/`, `programas/`, `robots.txt`, `sitemap.xml` y `site.webmanifest`.
