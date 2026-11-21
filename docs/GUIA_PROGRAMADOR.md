# Guía para programadores

> **Actualizado en HU26.** Lo técnico al día está en [`CODIGO.md`](CODIGO.md); los datos de la fundación se editan en `src/_data/site.json` ([`GUIA-CONTENIDO.md`](GUIA-CONTENIDO.md)).

Entrada principal para entender cómo está hecho el sitio, dónde vive cada cosa y cómo cambiarla sin romper nada.

## 1. Tipo de proyecto

Sitio institucional estático: HTML, CSS y JavaScript puro, sin framework, base de datos ni backend.
[Eleventy](https://www.11ty.dev/) 3 lo compila: toma las páginas de `src/`, les aplica la plantilla común y los datos de `src/_data/site.json`, y deja el sitio listo en `_site/`.

```bash
npm install      # solo la primera vez (Node.js 22, ver .nvmrc)
npm start        # servidor local en http://localhost:8080 que se recarga al guardar
npm run build    # compila en _site/ (lo mismo que hace Vercel)
npm run vendor:gsap     # solo si cambias la versión de GSAP o los plugins que se importan
```

Abrir el HTML con doble clic **no sirve**: las páginas de `src/` llevan etiquetas de plantilla (`{{ site.whatsapp }}`) y el JavaScript usa módulos ES, que el navegador no carga desde `file://`. Usa siempre `npm start`.

## 2. Estructura de carpetas

```text
landign-/
  src/                              Lo que se edita: páginas (misma ruta que en la web)
    _data/site.json                 WhatsApp, correo, redes y versiones de caché
    _includes/layouts/interna.njk   <head>, cabecera y pie de las 6 páginas internas
    index.html                      Portada (página completa, no usa la plantilla)
    programas/
      index.html                    Vista general de los 4 programas
      semilla.html · siembra.html · cosecha.html · psicosocial.html
    sede-espinal/index.html         Sede Espinal
  assets/                           Se copia tal cual a _site/assets/
    css/sitio.css                   Todo el estilo del sitio, en capas (@layer)
    fonts/                          Unbounded, Schibsted Grotesk y Space Mono
    css/seasonal/navidad.css        Temporada navideña
    js/main.js                      Arranca los módulos de la portada
    js/modules/                     Un archivo por funcionalidad
    js/seasonal.js · js/arranque.js   scripts mínimos del <head> (temporada y entrada)
    js/vendor/gsap.js               GSAP + ScrollTrigger + SplitText empaquetados (generado; no se edita a mano)
    img/opt/                        Imágenes WebP que usan las páginas
    img/{brand,hero,content,team}/  Originales
    videos/
  informes/                         PDF de informes de gestión
  api/chat.mjs                      Función de Vercel: el chat responde con Claude (POST /api/chat)
  api/_contexto.mjs                 Instrucciones y datos de la fundación que recibe el asistente
  eleventy.config.mjs               Qué se copia, el filtro whatsapp y las URL .html
  vercel.json                       Vercel ejecuta npm run build y publica _site/
  docs/                             Esta documentación y las auditorías
  _site/                            Sitio compilado (se genera; no está en Git)
```

## 3. Cómo se arma cada página

**Portada (`src/index.html`)**: es un HTML completo. Eleventy solo reemplaza las expresiones `{{ … }}` (datos de `site.json`) y la copia a `_site/index.html`.

**Páginas internas** (las 5 de `programas/` y `sede-espinal/`): solo guardan su `<main>` y un encabezado con sus datos:

```yaml
---
layout: layouts/interna.njk
title: "Programa Semilla | Fundación Amigos Como Arroz"
description: "Conoce el programa Semilla de la Fundación Amigos Como Arroz."
canonical: /programas/semilla.html
bodyClass: programs-detail-page        # opcional: clase extra del <body>
back:
  href: "../index.html#programas"      # enlace "volver" de la cabecera
  text: "Volver a programas"
---
```

La plantilla `interna.njk` pone alrededor el `<head>` (título, descripción, URL canónica, CSS y JS), la cabecera con el logo y el enlace de volver, y el pie con WhatsApp, correo y redes.

Las URL publicadas no cambian: `src/programas/semilla.html` se publica como `/programas/semilla.html`.

## 4. Datos compartidos: `src/_data/site.json`

| Campo | Uso |
|---|---|
| `whatsapp`, `whatsappLabel` | Número para `wa.me` y cómo se muestra. También lo lee el JavaScript. |
| `email`, `instagram`, `facebook` | Pie de página y enlaces de contacto. |
| `legal`, `sedes`, `donacion`, `impacto`, `faq`, `equipo`, `documentos`… | Todos los datos de la fundación (ver `GUIA-CONTENIDO.md`). La versión de caché del CSS y el JS ya no se escribe aquí: es una huella automática. |

En las páginas se usan así:

```njk
{{ site.email }}
{{ 'Hola, quiero más información.' | whatsapp }}   → https://wa.me/57…?text=Hola%2C%20quiero…
https://wa.me/{{ site.whatsapp }}                  → enlace sin mensaje
```

La portada escribe `whatsapp` y `whatsappLabel` en `<script type="application/json" id="site-data">`, y `assets/js/modules/config.js` los lee de ahí. Así el número está en un solo lugar.

## 5. Cambios comunes

| Quiero cambiar… | Edito |
|---|---|
| Texto, fotos o secciones de la portada | `src/index.html` |
| Contenido de un programa | `src/programas/<programa>.html` (y su tarjeta en `src/index.html`, sección `#programas`) |
| `<head>`, cabecera o pie de las páginas internas | `src/_includes/layouts/interna.njk` |
| WhatsApp, correo o redes | `src/_data/site.json` |
| Lo que sabe el asistente del chat | `api/_contexto.mjs` |
| Colores, tipografía, radios o sombras | tokens al inicio de `assets/css/sitio.css` |
| Aspecto de un componente | su bloque en `assets/css/sitio.css` |
| Una interacción | su módulo en `assets/js/modules/` |
| Activar o apagar la Navidad | `SEASON_CONFIG.mode` en `assets/js/seasonal.js` |

**Después de cambiar un CSS o JS** no hay que subir ninguna versión: la huella (`?v=`) se calcula sola al compilar.

## 6. Agregar un programa nuevo

1. Copia `src/programas/semilla.html` como `src/programas/nuevo.html`.
2. Cambia su encabezado `---` (título, descripción, `canonical: /programas/nuevo.html`) y su `<main>`.
3. En `src/index.html`, sección `#programas`, agrega una tarjeta `.program-card` con `href="programas/nuevo.html"`.
4. El sitemap se genera solo (`src/sitemap.njk`).
5. Reutiliza `.program-detail-card` y `.program-timeline`; solo agrega CSS si el diseño es distinto.
6. Actualiza [`PROGRAMAS.md`](PROGRAMAS.md).

## 7. Interacciones (JavaScript)

`assets/js/main.js` importa los módulos y los arranca en este orden (el menú va primero porque el scroll necesita saber si está abierto):

| Módulo | Qué hace |
|---|---|
| `config.js` | Selectores, preferencias de movimiento (`shouldLimitMotion`) y contacto. |
| `menu.js` | Menú hamburguesa: abrir/cerrar, foco en la primera entrada, Escape, `aria-expanded`. |
| `entrada.js` | Pantalla de entrada (solo pantallas grandes, se cierra sola). |
| `active-section.js` | Marca en el menú la sección visible. |
| `reveal.js` | Aparición de `.reveal` (escalonada entre los que entran juntos) y contadores `data-counter`. |
| `encaje.js` | Fotos enteras con relleno desenfocado en las cajas de forma fija (también en las páginas internas, vía `interna.js`). |
| `portada.js` | Pantalla de entrada, secuencia de palabras con el scroll (frase escrita y palabras) y punto rosa del cursor. |
| `movimiento.js` | Movimiento con GSAP dentro de `gsap.matchMedia()`: entrada del inicio, títulos letra a letra, fotos que se descubren, Sede Espinal fija, programas apilados, carruseles arrastrables y rebote de «Sigue». |
| `contact-form.js` | Valida el formulario (teléfono y correo opcionales) y abre WhatsApp con el mensaje. |
| `team-slider.js` | Carrusel del equipo. |
| `lazy-videos.js` | Carga los videos al pulsar. |
| `story-book.js` | Visor de la historia institucional: una página a la vez, con indicador segmentado. |
| `chatbot.js` | Asistente: las preguntas rápidas responden al instante; lo que se escribe lo responde Claude por `/api/chat` y, si falla, una respuesta fija. |
| `historias.js` | Indicador segmentado de arriba (un segmento por pantalla, se llena con ScrollTrigger) y botón Compartir de la barra. |

Las páginas internas no cargan `main.js` ni GSAP: cargan `interna.js` (menú, compartir, cookies, copiar y temporada).

## 8. Estilos (CSS)

El sitio tiene una sola hoja, `assets/css/sitio.css`, más `seasonal/navidad.css`. La dirección visual (presentación de marca) está descrita en [`../DESIGN.md`](../DESIGN.md).

- **Capas:** `@layer reset, tokens, base, layout, components, sections, utilities`. Una regla de una capa posterior gana sin subir la especificidad. No hay `!important` salvo `[hidden]` y el modo de movimiento reducido.
- **Tokens** (en la capa `tokens`): fondo `--vacio` y grafitos (`--tinta`, `--grafito`), texto `--texto`/`--texto-2`/`--texto-3`, `--rosa` (acción) y `--rosa-boton`, `--sol` (cifras y brillos), `--crema` para la sección clara de Momentos, `--brillo` y `--velo` sobre fotos, tipos `--f-display` (Unbounded), `--f-texto` (Schibsted Grotesk) y `--f-mono` (Space Mono), servidos desde `assets/fonts/`. La página es clara (#fbfaf8, tarjetas #ffffff, secciones alternas #eef3f7, texto #16202a); las zonas con texto sobre foto redefinen las mismas variables en azul noche (#0f1923) en la capa `tokens` de `sitio.css`, así que un componente no necesita colores propios para funcionar en las dos. Tamaños de letra solo con la escala `--t-nota`, `--t-etiqueta`, `--t-cuerpo`, `--t-lead`, `--t-destacado`, `--t-h3`, `--t-h2`, `--t-display-2`, `--t-h1` y `--t-gigante`; separaciones con `--e-1` a `--e-8` (de 4 en 4 px).
- **Pantalla** (`.pantalla`): cada sección ocupa al menos la altura de la ventana. El inicio enmarca la foto (`--marco`); Fundación y los programas ponen la foto enmarcada al lado del texto; Sede Espinal va a sangre con la palabra gigante. `.pantalla--larga` es para secciones de lectura.
- **Barra flotante** (`.site-header` en la portada, la misma en las internas): píldora fija abajo al centro con todas las acciones; el pie deja libre su alto con `--pie-libre`.
- **Etiqueta de sección** (`.eyebrow`): «■ Fundación» en monoespaciada encima del título, sin número (se quitó en la auditoría HU24).
- **Puntos de corte:** 480, 560, 640, 759/760, 899/900 y 1079/1080 px.

## 9. Formulario

`#contact-form` (en `src/index.html`) lleva `novalidate` porque `contact-form.js` valida nombre, teléfono, correo, interés y mensaje, marca los errores con `aria-invalid` y abre WhatsApp con el mensaje armado. No guarda datos ni envía correos: para eso haría falta un backend o un servicio externo.

## 10. Reglas de mantenimiento

- Edita `src/` y `assets/`, nunca `_site/`.
- No pongas JavaScript dentro del HTML: crea o amplía un módulo.
- No escribas el número, el correo ni las redes a mano: usa `site.json`.
- Reutiliza clases existentes antes de crear CSS nuevo.
- Mantén `alt` en las imágenes y prueba en celular cuando toques header, hero, programas, contacto o carrusel.
- Trabajo en Git: una rama por bloque → PR a `dev` → release de `dev` a `main` (publica en Vercel). Ver [`DESPLIEGUE.md`](DESPLIEGUE.md).

## 11. Verificaciones rápidas

```bash
npm run build                                   # debe terminar sin errores
grep -rn "573187073308" src assets/js           # solo debe aparecer en src/_data/site.json
node --check assets/js/main.js
```

Después abre `npm start` y revisa la portada y una página interna a 390 px y en escritorio.

## 12. Riesgos conocidos

- El formulario depende de WhatsApp.
- Antes de publicar, revisar datos reales: teléfono, correo, redes, nombres, fotos y permisos de imágenes.
