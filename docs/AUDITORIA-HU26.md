# Auditoría HU26 · sitio completo y profesional

Resumen de lo que se corrigió y se agregó en HU26, de cómo se midió y de lo que queda pendiente. Las decisiones
(con cómo revertirlas) están en [`DECISIONES-HU26.md`](DECISIONES-HU26.md) y la lista de tareas en
[`PROGRESO-HU26.md`](PROGRESO-HU26.md).

## Qué se corrigió y agregó

| Fase | Cambios principales |
|---|---|
| 1 · Errores visibles | Barra flotante sin desbordes de 320 a 1920 px (en todas las páginas se encogía y cortaba el último ícono); pastilla de Navidad visible en celular; entrada que no bloquea; texto de programas visible durante el apilado; informes 2025 y 5245; equipo desde `site.json`; Momentos en 4:3; fechas automáticas; respuestas fijas del chat; nieve solo sobre fotos; archivos renombrados; 8 textos alternativos corregidos. |
| 2 · Navegación | `<head>`, barra y pie comunes; páginas internas con la barra de la portada y menú; migas visibles y en JSON-LD; «Otros programas» y acción al final de cada programa; Compartir en todas las páginas; enlaces canónicos; `lang="es-CO"`. |
| 3 · Legal | `privacidad.html` y `terminos.html` (borradores con aviso de revisión y `noindex`); autorización de datos, aviso de menores y resumen de errores en el formulario; línea de privacidad en el chat; aviso de cookies con GA4 solo con permiso. |
| 4 · Donar | `donar.html` (medios con copiar, pasarela, montos, especie, beneficio tributario, empresas), destino único de «Donar», `voluntariado.html`, `aliados.html` y franja de logos; eventos de analítica. |
| 5 · Confianza | Sedes, documentos, cifras con corte y fuente, Quiénes somos, preguntas frecuentes, convocatorias y testimonios desde `site.json`; `transparencia.html`; noticias en Markdown; 404. |
| 6 · SEO | Open Graph y Twitter con imágenes de 1200 × 630; títulos y descripciones únicos; íconos y manifiesto; JSON-LD (NGO, Service, Place, BreadcrumbList, FAQPage, DonateAction) validado; sitemap automático; `robots.txt`; redirecciones. |
| 7 · Rendimiento | esbuild (JS y CSS minificados, huellas automáticas); GSAP diferido y solo en la portada, con arranque en tareas cortas; entrada solo en pantallas grandes; relleno del inicio pre-desenfocado; publicación solo de lo usado; videos 63 → 40 MB; PDF 2025 18,6 → 3,1 MB y 2024 4,1 → 2,5 MB; `npm run imagenes`. |
| 8 · Accesibilidad | Carruseles con teclado y posición anunciada; libro con flechas y `aria-disabled`; menú y chat como diálogos; un solo `h1` y sin saltos; nombres de enlace únicos; aviso de pestaña nueva en todo enlace externo. |
| 9 · Seguridad | CSP sin `unsafe-inline` en scripts (0 violaciones), HSTS y demás encabezados; caché por tipo; chat con Haiku, 400 tokens, `CHAT_ACTIVO`, límite de cuerpo y contexto desde `site.json`; `security.txt`. |
| 10 · Pruebas | `npm test` (15 pruebas), `npm run check`, `npm run lint`, `npm run test:e2e` (Playwright en Chromium, Firefox y WebKit a 390 y 1440 px, con datos vacíos y de ejemplo), `npm run lighthouse` y GitHub Actions. |

## Mediciones

Medido en local con un servidor con gzip (como Vercel), Lighthouse 12.8.2 móvil, **mediana** de varias corridas:
en este equipo los tiempos varían mucho de una corrida a otra (el mismo sitio dio entre 54 y 82 de rendimiento).

### Lighthouse móvil (mediana de 3, con gzip)

| Página | Rendimiento antes → después | Accesibilidad | Buenas prácticas | SEO | LCP antes → después | TBT antes → después | CLS |
|---|---|---|---|---|---|---|---|
| Portada | 66 → **81** | 100 → 100 | 100 | 100 | 4,0 s → **3,0 s** | 730 → 493 ms | 0 |
| Semilla | 71 → 76 | 95 → **100** | 100 | 100 | 2,5 s → 2,7 s | 1526 → 869 ms | 0 |
| Siembra | — → 72 | — → **100** | 100 | 100 | — → 4,0 s | — → 620 ms | 0 |
| Cosecha | — → 80 | — → 100 | 100 | 100 | — → 2,9 s | — → 580 ms | 0 |
| Acompañamiento psicosocial | — → 91 | — → 100 | 100 | 100 | — → 3,1 s | — → 156 ms | 0 |
| Sede Espinal | 82 → 76 | 95 → **100** | 100 | 100 | 2,5 s → 2,7 s | 499 → 839 ms | 0 |
| Donar (nueva) | 99 | 100 | 100 | 100 | 2,1 s | 0 ms | 0 |
| 404 (nueva) | 99 | 100 | 100 | 69 (lleva `noindex` a propósito) | 2,1 s | 0 ms | 0 |

La línea base de las páginas que no se midieron antes se marca «—». Sin gzip (como en `auditoria-hu26/ANTES.md`)
la portada pasó de 62 a 79 de mediana en 5 corridas y el LCP dejó de ser el texto de «Entrar» para ser la foto.

**Lo que el ruido no explica:** la portada mejora en todo (LCP −1 s, bloqueo −240 ms, ya no hay pantalla que
tape el inicio en celular). En las internas el rendimiento oscila con el bloqueo (Siembra, sin casi JS, dio 86
con 0 ms en una corrida y 65 con 1,39 s en la siguiente), así que esas diferencias no son significativas.

### Lighthouse escritorio (1 corrida)

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Portada | 89 | 100 | 100 | 100 | 0,7 s | 245 ms | 0,014 |
| Semilla | 99 | 100 | 100 | 100 | 0,6 s | 93 ms | 0 |
| Siembra | 91 | 100 | 100 | 100 | 0,9 s | 212 ms | 0 |
| Cosecha | 99 | 100 | 100 | 100 | 0,8 s | 44 ms | 0 |
| Acompañamiento psicosocial | 97 | 100 | 100 | 100 | 0,9 s | 123 ms | 0 |
| Sede Espinal | 96 | 100 | 100 | 100 | 0,7 s | 147 ms | 0 |
| Donar | 100 | 100 | 100 | 100 | 0,6 s | 0 ms | 0 |
| 404 | 100 | 100 | 100 | 69 (`noindex`) | 0,6 s | 0 ms | 0 |

### Peso

| Recurso | Antes | Después |
|---|---|---|
| Videos publicados | 63 MB | 40 MB |
| Informe 2025 (PDF) | 18,6 MB | 3,1 MB (el original queda como versión en alta calidad) |
| Informe 2024 (PDF) | 4,1 MB | 2,5 MB |
| Primera carga de la portada (móvil, con gzip) | 459 KB | 479 KB (incluye las fuentes y GSAP diferido; menos de 700 KB) |

### Recorrido con Playwright (14 páginas, 320 a 1920 px)

| Revisión | Antes | Después |
|---|---|---|
| Errores de consola y respuestas 4xx/5xx | 0 | 0 |
| Desborde de la barra flotante | 37 px en la portada, 22 px en las internas (celular) | 0 en 9 anchos, con y sin animaciones |
| axe-core, errores serios o críticos | Falsos positivos de contraste sobre fotos | 0 (axe 4.14) |
| Violaciones de CSP | — (no había CSP) | 0 |
| Textos de la fundación que desaparecieron | — | Ninguno (solo cambian los textos que pidió el encargo: informes, «Ver», pie con Espinal y migas en vez de «Volver») |

## Lo que quedó pendiente

- **Rendimiento móvil ≥ 90 en todas las páginas (7.1):** no se alcanza de forma estable en este equipo. Las
  mejoras se hicieron y se midieron (ver arriba), pero el bloqueo del hilo principal en Lighthouse varía tanto entre
  corridas que el número final depende más del equipo que del sitio. Conviene medir en la vista previa de Vercel con
  PageSpeed Insights. Lo que más podría ayudar después: fotos de portada más livianas en las internas (Siembra pesa
  638 KB) y revisar si GSAP puede cargarse solo cuando la persona empieza a bajar.
- **Política de datos y términos:** borradores; los debe revisar un abogado (`legal.politicaRevisada`).
- **Logo en alta resolución o vector:** los íconos de 192 y 512 px salen de un logo de 160 px.
- **Git LFS:** el repositorio pesa más de 100 MB por los originales de videos y PDF; conviene moverlos a LFS.

- Los datos que debe entregar la fundación: [`DATOS-PENDIENTES.md`](DATOS-PENDIENTES.md).
