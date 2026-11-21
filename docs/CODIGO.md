# Documentación técnica del código

Detalle de cómo funciona cada pieza. Para la vista general (carpetas, cambios comunes, flujo de trabajo) lee
primero [`GUIA_PROGRAMADOR.md`](GUIA_PROGRAMADOR.md).

## 1. Compilación

`eleventy.config.mjs`:

- **Entrada `src/`, salida `_site/`.** Se procesan `.html`, `.njk` y `.md` (los `README.md` de `src/` no se
  publican). Las páginas HTML se leen como plantillas Nunjucks: pueden usar `{{ site.* }}`, filtros y `layout`.
- **`permalink` global `{{ page.filePathStem }}.html`:** URL con `.html` (`/programas/semilla.html`). Los enlaces
  internos usan la forma canónica de las carpetas (`programas/`, `sede-espinal/`).
- **Recursos que se copian** (lista `RECURSOS`): `assets/img/opt`, `iconos`, `compartir`, `fonts`, los videos
  comprimidos, los subtítulos, los PDF, `robots.txt`, el manifiesto y el favicon. Los originales no se publican.
- **`eleventy.after` → `scripts/empaquetar.mjs`:** esbuild empaqueta `main.js` e `interna.js` (con *code
  splitting*: lo que se importa diferido queda en `assets/js/chunks/` con huella en el nombre), minifica
  `arranque.js` y `seasonal.js`, y minifica el CSS.
- **Transformación `html`:** agrega «(se abre en una pestaña nueva)» oculto a los enlaces con `target="_blank"`
  que no lo digan y quita comentarios y sangría del HTML.
- **Datos globales:** `site` (`src/_data/site.json`), `fechas` (`src/_data/fechas.js`: año, años de trayectoria,
  mes y fecha de hoy), `donar.pagina` (si hay medios o pasarela) y `entorno` (`VERCEL_ENV`).
- **Filtros:** `whatsapp`, `raiz` (prefijo relativo según la profundidad de la página), `huella`, `numero`,
  `fechaLarga`, `peso`, `json` (seguro dentro de `<script>`), `faqDe`, `convocatoriasAbiertas`, `migasLd`,
  `ngoLd`, `lugarLd`, `faqLd`, `programaLd`, `esIndexable` y `paraSitemap`. **Shortcode** `donarAtributos`:
  el `href` de Donar (y `target`/`rel` cuando es WhatsApp). La lógica vive en `lib/sitio.mjs`, con pruebas.
- **`SITIO_DATOS`:** carpeta de datos alternativa; la usa `npm run build:ejemplo` (`scripts/ejemplo.mjs`).

**GSAP 3.15.0.** `assets/js/vendor/gsap.js` es GSAP con ScrollTrigger y SplitText, generado con
`npm run vendor:gsap` desde `gsap-entry.js` (solo los plugins que se usan). esbuild lo incluye en el *chunk*
diferido de las animaciones: no lo descargan las páginas internas.

## 2. Plantillas

- **`partials/head.njk`:** meta, Open Graph, Twitter, canónica, `robots` (`indexar: false` → `noindex`),
  verificación de Search Console, íconos, manifiesto, precarga de las 2 fuentes del inicio, CSS y `seasonal.js`.
- **`partials/nav.njk`:** la barra flotante (en la portada, enlaces a secciones; en las internas, a páginas, con
  los 4 programas en el panel del menú). **`partials/pie.njk`:** el pie común.
- **`layouts/interna.njk`:** `<head>`, JSON-LD de migas (y de programa o sede si aplica), barra, migas visibles,
  `<main>` con el contenido y, en los programas, convocatorias, preguntas frecuentes y «Otros programas».
  Encabezado de cada página: `title`, `description`, `canonical`, `nombre`, `migas`, `programa`, `lugar`,
  `ogImagen`, `bodyClass`, `indexar`, `raizFija` (la 404 usa `/`).
- **Bloques que aparecen solo con datos:** `faq`, `convocatorias`, `quienes`, `franja-aliados`, `sede`,
  `documento`, `aviso-legal`.

## 3. CSS

`assets/css/sitio.css` (más `seasonal/navidad.css`). Dirección visual en [`../DESIGN.md`](../DESIGN.md).

```css
@layer reset, tokens, base, layout, components, sections, utilities;
```

| Capa | Contenido |
|---|---|
| `reset` | Márgenes, `box-sizing` y `[hidden]`. |
| `tokens` | Colores, velos, tipos, espacios, radios, curvas. |
| `base` | Cuerpo, títulos, enlaces, foco. |
| `layout` | `.pantalla`, `.pantalla-fondo`, `.pantalla-cuerpo`, `.lead`, `.eyebrow`. |
| `components` | Botones, `.historias`, barra flotante y menú, cursor, chat, carruseles, videos, listas. |
| `sections` | Cada sección; páginas internas; pie, migas, páginas de texto, Donar, FAQ, aviso de cookies. `navidad.css` también va aquí. |
| `utilities` | Entrada de `.reveal` (solo con `html.js`), movimiento reducido e impresión. |

## 4. JavaScript

### Carga

- **`<head>`, sin `defer`:** `seasonal.js` (decide la temporada y pone `html.js`) y, en la portada,
  `arranque.js` (decide la entrada y la animación del inicio). Son mínimos.
- **`main.js`** (portada) e **`interna.js`** (las demás): módulos ES empaquetados. `main.js` arranca todo lo que
  no usa GSAP y, después de la primera pintura, importa `modules/animaciones.js` (GSAP), que arranca cada parte
  en una tarea corta. Al terminar ponen `html[data-listo]` (lo usan las pruebas).

### `modules/config.js`

Lee `#site-data` (JSON que Eleventy escribe desde `site.json`): `SITE_DATA`, `CONTACT`, `WHATSAPP_URL`, los
`SELECTORS` y las preferencias de movimiento (`prefersLessMotion`, `shouldLimitMotion`).

### Módulos

| Módulo | Qué hace |
|---|---|
| `entrada.js` | Pantalla de entrada (solo pantallas ≥ 900 px y primera visita): se cierra sola a los 1,2 s desde que empezó la carga, o con scroll, toque, clic, tecla o «Saltar al contenido». Avisa con `entrada:cerrada`. |
| `menu.js` | Panel del menú como diálogo (con `foco.js`): foco dentro, Escape y fondo cierran, `aria-expanded`. |
| `foco.js` | `atraparFoco(panel, boton)`: Tab y Mayús+Tab en círculo dentro del panel. |
| `active-section.js` | `.active` en el enlace de la sección visible. |
| `reveal.js` | `.visible` en `.reveal` al entrar en pantalla y contadores `data-counter`. |
| `contact-form.js` | Validación con `aria-invalid`, autorización de datos obligatoria, aviso de menores, resumen de errores con foco y enlaces; abre WhatsApp con el mensaje armado. |
| `team-slider.js` | Equipo: anterior/siguiente, puntos, avance automático que se pausa con el cursor o el foco dentro. |
| `carruseles.js` | Todos los carruseles: roles, flechas del teclado, Anterior/Siguiente, «N de T» en `role="status"`. |
| `lazy-videos.js` | Carga cada video al pulsar su póster; subtítulos si hay `data-captions`; registra el evento. |
| `encaje.js` | Fotos sin recortar con relleno desenfocado. |
| `story-book.js` | Libro de la historia: una página a la vez, flechas del teclado, `aria-disabled` en los extremos. |
| `chatbot.js` | Panel del chat como diálogo; lo escrito va a `/api/chat`; si falla, `respuestas.js`. |
| `respuestas.js` | Respuestas fijas desde `#site-data` (sedes, FAQ, donar, RTE); sin dato claro, remite al equipo por WhatsApp con la pregunta. Sin DOM: tiene pruebas. |
| `compartir.js` | Web Share API o copia del enlace, anunciada en `role="status"`. |
| `eventos.js` | `registrarEvento()` y registro de los clics con `data-analytics-*` (solo si GA está cargado). |
| `cookies.js` | Aviso de cookies y carga de GA4 solo con permiso; «Preferencias de cookies» del pie. |
| `copiar.js` | Botones «Copiar número» de Donar, con anuncio en `role="status"`. |
| `temporada.js` | Guirnalda, nieve (solo sobre las fotos del inicio, la campaña y las portadas internas; no con movimiento reducido ni Save-Data), botón Nieve y cuenta regresiva. |
| `animaciones.js` | Importa y arranca, en tareas separadas, `movimiento.js`, `portada.js` e `historias.js` (los que usan GSAP). |
| `movimiento.js` | Movimiento de la portada dentro de `gsap.matchMedia()` (nada con movimiento reducido). Ver `DESIGN.md`. |
| `portada.js` | Secuencia de palabras `.ciclo` y punto que sigue al cursor. |
| `historias.js` | Indicador segmentado `#historias`. |

## 5. Asistente con Claude (`api/`)

- **`api/chat.mjs`** (`POST /api/chat`): SDK oficial `@anthropic-ai/sdk`, modelo `claude-haiku-5-5`,
  `max_tokens: 400`, prompt del sistema con caché. Solo `POST`, solo desde el dominio, `landign*.vercel.app` o
  `localhost`, máximo 8 mensajes por minuto e IP (en memoria; cómo pasarlo a Upstash está en el código), cuerpo
  de máximo 8 KB, 1 a 600 caracteres por mensaje y 8 turnos. `CHAT_ACTIVO=false` lo apaga. Los registros no
  guardan el texto de los usuarios.
- **`api/_contexto.mjs`:** arma las instrucciones y los datos desde `site.json` (`armarContexto`), con la regla
  de no pedir ni guardar datos de menores. No escribas datos a mano aquí: cámbialos en `site.json`.

## 6. Imágenes, videos y PDF

- **Imágenes:** WebP de `assets/img/opt/` (480, 960, 1600 px) con `srcset`; `npm run imagenes` crea las de los
  originales nuevos. El relleno del inicio es una imagen ya desenfocada (`…-relleno-480.webp`).
- **Íconos y compartir:** `npm run iconos` y `npm run compartir` (sharp).
- **Videos:** comprimidos en `assets/videos/`; originales en `assets/videos/originales/` (no se publican).
- **PDF:** versión web en la URL de siempre y original como `…-ALTA-CALIDAD.pdf`.

## 7. Pruebas y calidad

- `npm test` → `test/unitarias.test.mjs` (`node:test`).
- `npm run check` → `scripts/verificar.mjs` (referencias, JSON-LD, sitemap, textos de relleno) y `html-validate`.
- `npm run lint` → ESLint (`eslint.config.mjs`) y Stylelint (`.stylelintrc.json`), reglas mínimas.
- `npm run test:e2e` → Playwright (`playwright.config.cjs`, `test/e2e/sitio.spec.cjs`). Va en CommonJS porque
  Playwright 1.49 se queda cargando pruebas ES con Node 24. `CHROMIUM_PATH` permite usar un Chromium ya instalado.
- `npm run lighthouse` → `scripts/lighthouse.mjs` (mediana de varias corridas y umbrales).

## 8. Reglas para mantener el código limpio

1. Datos en `site.json`; contenido en `src/`; aspecto en `assets/css/`; comportamiento en `assets/js/modules/`.
2. Nada de JavaScript en línea en el HTML (la CSP lo bloquearía): todo va en archivos.
3. CSS nuevo con los tokens existentes y en la capa que corresponde, sin `!important`.
4. Las secciones del menú necesitan un `id` claro. Todas las imágenes, un `alt` real.
5. Lógica nueva de la compilación en `lib/sitio.mjs`, con su prueba.
