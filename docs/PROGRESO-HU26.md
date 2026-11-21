# Progreso HU26 · Sitio completo y profesional

Lista de trabajo del encargo HU26. Si la sesión se corta, se sigue desde la primera casilla sin marcar.
`[x]` hecho · `[ ]` pendiente · `[!]` bloqueado (con el motivo al lado).

Rama de trabajo: `hu27` (la rama `hu26` ya existía y estaba fusionada; ver `DECISIONES-HU26.md`).

## Fase 0 · Línea base
- [x] 0.1 `npm install` y `npm run build`
- [x] 0.2 Capturas 390 y 1440, Lighthouse móvil (portada, Semilla, Sede Espinal) y axe por página en `docs/auditoria-hu26/antes/` (capturas fuera de Git, resumen en Markdown)

## Fase 1 · Errores visibles
- [x] 1.1 Barra flotante sin desbordes de 320 a 1920 px (botón Nieve)
- [x] 1.2 Pastilla de Navidad del inicio libre en celular
- [x] 1.3 Pantalla de entrada que no bloquea (1,2 s, primer gesto; nunca con movimiento reducido, Save-Data, ancla ni bots)
- [x] 1.4 GSAP: texto de programas siempre visible y ESPINAL sin cortes (1024, 1280, 1440, 1920 y 1280×650)
- [x] 1.5 Informes: textos del 2025 y del formulario 5245
- [x] 1.6 Equipo desde `site.json`, cargo sin nombre y rol de Caren pendiente
- [x] 1.7 Momentos con proporción fija y encuadre
- [x] 1.8 Fechas automáticas (años, pie, «próximamente», Navidad hasta el 6 de enero)
- [x] 1.9 Respuestas fijas del chat (remitir al equipo, nuevas respuestas desde `site.json`)
- [x] 1.10 Decoración de Navidad: sin tapar, solo inicio y campaña, Save-Data, contraste
- [x] 1.11 Nombres de archivo (`drirectora`, `testimoni1`)
- [x] 1.12 Textos alternativos

## Fase 2 · Navegación y estructura
- [x] 2.1 Navegación completa en páginas internas con menú móvil (reutiliza `menu.js`)
- [x] 2.2 Migas de pan visibles y `BreadcrumbList`
- [x] 2.3 «Otros programas» y bloque de acción en cada programa
- [x] 2.4 Pie común (include)
- [x] 2.5 `<head>` común (include)
- [x] 2.6 Rutas relativas en raíz y subcarpetas
- [x] 2.7 Enlaces internos canónicos
- [x] 2.8 Compartir con Web Share API o copia anunciada, también en internas

## Fase 3 · Legal y datos personales
- [x] 3.1 `privacidad.html` (aviso de revisión legal, `noindex` hasta `politicaRevisada`)
- [x] 3.2 `terminos.html`
- [x] 3.3 Formulario: autorización, aviso de menores, resumen de errores
- [x] 3.4 Línea fija de privacidad en el chat
- [x] 3.5 Aviso de cookies (GA solo si acepta; preferencias en el pie; sin aviso si no hay ID)
- [x] 3.6 ID de GA4 en `site.json` vía `#site-data`
- [x] 3.7 Política y términos en el pie y en el sitemap (entran solos al sitemap cuando `politicaRevisada` es `true`)

## Fase 4 · Donaciones, voluntariado y alianzas
- [x] 4.1 `donar.html`
- [x] 4.2 Botones «Donar» con destino global
- [x] 4.3 `voluntariado.html`
- [x] 4.4 `aliados.html` y franja de logos
- [x] 4.5 Eventos de analítica nuevos

## Fase 5 · Confianza e información institucional
- [x] 5.1 Bloque `legal`
- [x] 5.2 Pie con todo el contenido institucional
- [x] 5.3 Sedes en `site.json`, Contacto y Sede Espinal con «Cómo llegar»
- [x] 5.4 `transparencia.html` desde `documentos`
- [x] 5.5 Cifras de impacto en `site.json` con corte y fuente
- [x] 5.6 Quiénes somos (misión, visión, valores, junta)
- [x] 5.7 Preguntas frecuentes con `FAQPage`
- [x] 5.8 Convocatorias
- [x] 5.9 Testimonios en video (subtítulos, transcripción, datos)
- [x] 5.10 Noticias (estructura lista)
- [x] 5.11 Correo desde `site.email`
- [x] 5.12 Página 404

## Fase 6 · SEO
- [x] 6.1 Open Graph y Twitter en todas las páginas, imágenes 1200×630 (`npm run compartir`)
- [x] 6.2 Títulos y descripciones únicos
- [x] 6.3 Íconos y `site.webmanifest`
- [x] 6.4 JSON-LD (NGO, programas, Breadcrumb, FAQ, DonateAction, Place) y su validación (en `npm run check`)
- [x] 6.5 Sitemap automático
- [x] 6.6 `robots.txt` con `Disallow: /api/`
- [x] 6.7 Verificación de Search Console
- [x] 6.8 Redirecciones en `vercel.json`

## Fase 7 · Rendimiento
- [!] 7.1 Objetivos Lighthouse: portada 66 → 81 (mediana con gzip), LCP 4,0 → 3,0 s; escritorio 89 a 100; accesibilidad, prácticas y SEO en 100 (404 con `noindex`). El rendimiento móvil ≥ 90 no es estable en este equipo: la misma página varía entre 65 y 95 de una corrida a otra. Intentado: GSAP diferido y por tareas, foto principal de Siembra de 185 a 86 KB en celular (versión de 720 px), entrada solo en pantallas grandes, relleno pre-desenfocado, fondo de entrada liviano, minificación. Ver `AUDITORIA-HU26.md`.
- [x] 7.2 Publicar solo lo que se usa y verificar referencias
- [x] 7.3 Minificación y huellas automáticas
- [x] 7.4 `npm run imagenes`
- [x] 7.5 GSAP solo con lo usado y diferido
- [x] 7.6 CSS crítico (solo si mejora el LCP): no se aplicó, ver decisión 33
- [x] 7.7 `content-visibility`: no se aplicó, ver decisión 34
- [x] 7.8 Fuentes
- [x] 7.9 PDF comprimidos y peso visible
- [x] 7.10 Videos comprimidos y pósteres
- [x] 7.11 Temporada diferida y liviana

## Fase 8 · Accesibilidad
- [x] 8.1 Carruseles (teclado, botones, posición anunciada)
- [x] 8.2 Libro de historia
- [x] 8.3 Menú móvil y chat como diálogos
- [x] 8.4 «Saltar al contenido» cierra la entrada
- [x] 8.5 Contraste
- [x] 8.6 Zoom 200 % y 400 %
- [x] 8.7 Encabezados, landmarks y nombres de enlaces
- [x] 8.8 Aviso de pestaña nueva
- [x] 8.9 `lang="es-CO"`

## Fase 9 · Seguridad y chat
- [x] 9.1 Encabezados de seguridad y CSP sin violaciones
- [x] 9.2 Caché en `vercel.json`
- [x] 9.3 `api/chat.mjs` (Haiku, 400 tokens, `CHAT_ACTIVO`, tamaño del cuerpo, registros sin texto)
- [x] 9.4 `api/_contexto.mjs` desde `site.json`
- [x] 9.5 `security.txt`
- [x] 9.6 `rel="noopener noreferrer"` en enlaces externos

## Fase 10 · Pruebas e integración continua
- [x] 10.1 `npm test`, `test:e2e`, `check`, `lighthouse`, `lint`
- [x] 10.2 GitHub Actions
- [x] 10.3 Node fijo (`engines`, `.nvmrc`)
- [x] 10.4 Errores de las herramientas corregidos

## Fase 11 · Documentación
- [x] 11.1 README y docs al día
- [x] 11.2 Auditorías anteriores marcadas como históricas y `AUDITORIA-HU26.md`
- [x] 11.3 `GUIA-CONTENIDO.md`
- [x] 11.4 `DATOS-PENDIENTES.md`

## Verificación final
- [x] V.1 build, test, check, lint y e2e en verde (e2e: 216 pruebas en Chromium, Firefox y WebKit)
- [x] V.2 Capturas de todas las páginas en 7 anchos, con y sin Navidad (196 capturas en `docs/auditoria-hu26/despues/`, fuera de Git): sin desbordes ni elementos vacíos (revisión automática) y revisadas en hojas de contacto
- [x] V.3 Lighthouse móvil y escritorio (8 páginas; cifras en `AUDITORIA-HU26.md`)
- [x] V.4 axe sin errores serios ni críticos (en las pruebas e2e de las 14 páginas, 3 navegadores, 2 anchos, datos vacíos y de ejemplo)
- [x] V.5 Sin JS, movimiento reducido, zoom (320 y 640 px), teclado, datos vacíos y de ejemplo
- [x] V.6 Comparación automática de textos antes y después (solo cambian los textos pedidos; ver `AUDITORIA-HU26.md`)
- [x] V.7 Push y PR hacia `dev`
