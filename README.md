# Fundación Amigos Como Arroz

Sitio web institucional de la Fundación Amigos Como Arroz (Neiva, Huila · Espinal, Tolima). Es un sitio estático
con HTML, CSS y JavaScript en módulos que [Eleventy](https://www.11ty.dev/) arma a partir de `src/`; esbuild
empaqueta y minifica el JS y el CSS, y Vercel lo publica. El chat de ayuda usa una función de Vercel
(`api/chat.mjs`) con Claude.

## Cómo abrirlo

Necesitas Node.js 22 (está en `.nvmrc`; sirve desde la 20).

```bash
npm install             # solo la primera vez
npm start               # compila y abre http://localhost:8080; se recarga al guardar
npm run build           # compila el sitio listo para publicar en _site/
npm run build:ejemplo   # compila en _site-ejemplo/ con datos de ejemplo (para ver las secciones que hoy están ocultas)
```

Edita siempre `src/`, `assets/` y `src/_data/site.json`. `_site/` se genera y no se sube a Git.

## Dónde se cambia cada cosa

- **Datos de la fundación** (contacto, sedes, legal, donaciones, cifras, equipo, preguntas frecuentes, aliados,
  convocatorias, documentos, testimonios): solo en `src/_data/site.json`. Lo que esté vacío no se muestra.
  Guía para no programadores: [docs/GUIA-CONTENIDO.md](docs/GUIA-CONTENIDO.md). Lo que falta entregar:
  [docs/DATOS-PENDIENTES.md](docs/DATOS-PENDIENTES.md).
- **Textos de la portada:** `src/index.html`. **Páginas internas:** `src/programas/`, `src/sede-espinal/` y las
  páginas de la raíz (`donar`, `voluntariado`, `aliados`, `transparencia`, `privacidad`, `terminos`, `404`).
- **Lo común** (`<head>`, barra, pie, migas, bloques que aparecen con datos): `src/_includes/`.
- **Estilos:** `assets/css/sitio.css` (dirección visual en `DESIGN.md`). **Interacciones:** `assets/js/modules/`.

## Estructura

```text
src/
  _data/site.json               Todos los datos de la fundación
  _data/fechas.js               Años de trayectoria, año del pie y fecha de hoy (se calculan al compilar)
  _includes/layouts/            interna.njk (páginas internas) y noticia.njk
  _includes/partials/           head, nav, pie, sede, documento, faq, convocatorias, quienes, franja-aliados…
  index.html                    Portada
  programas/ · sede-espinal/    Páginas de programas y de la sede
  donar.html · voluntariado.html · aliados.html · transparencia.html
  privacidad.html · terminos.html · 404.html
  noticias/                     Noticias en Markdown (sin noticias no se publica el listado)
  sitemap.njk · security.njk    sitemap.xml y /.well-known/security.txt automáticos
lib/sitio.mjs                   Funciones de la compilación (filtros, JSON-LD, minificación): con pruebas
scripts/                        empaquetar (esbuild), verificar (npm run check), imagenes, iconos, compartir,
                                ejemplo, lighthouse, servir, limpiar
api/chat.mjs · api/_contexto.mjs  Función del chat (Claude) y su contexto, armado desde site.json
assets/
  css/sitio.css · css/seasonal/navidad.css
  js/main.js · js/interna.js    Entradas de la portada y de las internas (esbuild las empaqueta)
  js/arranque.js · js/seasonal.js  Scripts mínimos del <head> (entrada y temporada)
  js/modules/                   Un archivo por funcionalidad
  img/opt/                      Fotos WebP que usa el sitio · img/iconos/ · img/compartir/ (1200 × 630)
  img/{brand,hero,content,team}/ · semilla/ · siembra/ · cosecha/ · psicologia/   Originales (no se publican)
  videos/                       Videos comprimidos · videos/originales/ (no se publican) · videos/subtitulos/
informes/                       PDF de transparencia (versión web y versión en alta calidad)
test/                           Pruebas unitarias (node:test) y de navegador (test/e2e, Playwright)
```

## Comandos de calidad

| Comando | Qué hace |
|---|---|
| `npm test` | Pruebas unitarias (filtros, fechas, JSON-LD, chat, respuestas fijas, temporada). |
| `npm run check` | Revisa `_site/`: archivos referenciados, JSON-LD, sitemap, textos de relleno y HTML válido. |
| `npm run lint` | ESLint y Stylelint con reglas mínimas. |
| `npm run test:e2e` | Playwright en Chromium, Firefox y WebKit a 390 y 1440 px (antes: `npm run build` y `npm run build:ejemplo`). |
| `npm run lighthouse` | Lighthouse móvil en las páginas clave con los umbrales del proyecto (sirve `_site` antes con `node scripts/servir.mjs _site 8180`). |
| `npm run imagenes` | Versiones WebP (480, 960 y 1600 px) de las fotos originales nuevas. |
| `npm run iconos` · `npm run compartir` | Íconos y favicon desde el logo; imágenes para compartir de 1200 × 630. |

GitHub Actions (`.github/workflows/ci.yml`) corre build, pruebas, check, lint y Playwright (Chromium) en cada
PR y en cada push a `dev`, `qa` y `main`; Lighthouse va como aviso en los PR.

## Caché y huellas

El JS y el CSS llevan `?v=<huella>`, calculada del contenido al compilar: no hay números de versión que subir a
mano. Vercel guarda en caché por un año los recursos de `assets/` (`immutable`) y revalida siempre el HTML.
Si reemplazas una foto de `assets/img/opt/`, dale otro nombre (`npm run imagenes` ya lo hace).

## Seguridad

`vercel.json` define la CSP (sin `unsafe-inline` en scripts), `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, `X-Frame-Options`, HSTS y las redirecciones (www, `/index.html`). No pongas scripts en
línea en el HTML: van en archivos de `assets/js/`.

## Analítica y cookies

Google Analytics 4 solo se carga si la persona acepta el aviso de cookies. Para activarlo, escribe el ID
(`G-…`) en `analytics.ga4` de `site.json`. Sin ID no hay aviso ni medición. Los clics con
`data-analytics-event` se registran solos (donar, copiar medio de pago, pasarela, certificado, formulario, chat,
videos, PDF, compartir y cookies).

## Chat

Variables de entorno en Vercel: `ANTHROPIC_API_KEY` (obligatoria para que responda Claude) y `CHAT_ACTIVO`
(`false` lo apaga y el chat usa solo las respuestas fijas). Usa `claude-haiku-5-5` con respuestas cortas.

## Temporada de Navidad

Se enciende sola del 15 de noviembre al 6 de enero. Para forzarla o apagarla, cambia `mode` en
`assets/js/seasonal.js` (`"auto"`, `"on"` u `"off"`). Vista previa: `?temporada=navidad` o `?temporada=off`.

## Correo con dominio propio

El sitio lee el correo de `site.email`. Cuando exista, conviene cambiarlo por
`contacto@fundacionamigoscomoarroz.com` (o el que se cree): se actualiza en todo el sitio, el chat y
`security.txt`.

## Despliegue

Vercel compila y publica solo: cada PR genera una vista previa y cada fusión en `main` publica producción.
Checklist en [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md). Más documentación en [docs/README.md](docs/README.md).
