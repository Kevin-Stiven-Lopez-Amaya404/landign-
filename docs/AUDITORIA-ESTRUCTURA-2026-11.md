# Auditoría de código, estructura y diseño · noviembre 2026

> **Documento histórico.** Describe el sitio antes de HU26 y ya no corresponde al estado actual. Lo vigente está en [AUDITORIA-HU26.md](AUDITORIA-HU26.md) y [README.md](README.md).

**Proyecto:** sitio web de la Fundación Amigos Como Arroz (7 páginas estáticas).
**Alcance:** `index.html`, `programas/*.html`, `sede-espinal/index.html`, `assets/` (CSS, JS, imágenes y videos), `docs/` e `informes/`.
**Método:** medición automática del código (selectores, duplicados, tokens, recursos), Chromium sin interfaz en 320, 390, 768, 1024 y 1440 px, axe-core (WCAG 2.1 A/AA) en todas las páginas, y revisión manual.

> Complementa a [AUDITORIA-2026-11.md](AUDITORIA-2026-11.md), que documenta las correcciones ya aplicadas y la temporada navideña. Las cifras de este informe se tomaron **después** de esas correcciones (v47).
>
> **Revisión del 18-11-2026:** se verificaron las cifras contra el código y en el navegador. Se corrigieron E4, H2, D8, J1 y la lista de reglas sin uso, y se añadieron 3 riesgos (sección 6.4). Lo aplicado en la versión v48 está en la sección 8.

---

## Veredicto

| Capa | ¿Escala? | Resumen |
|------|----------|---------|
| HTML (contenido y semántica) | 🟡 **Parcial** | Semántica buena, pero cabecera, pie y `<head>` están copiados a mano en 7 páginas, y cada página interna tiene una navegación distinta. |
| CSS | 🔴 **No** | La mitad de los bloques sobrescribe a otros, hay 545 `!important` y no existe un sistema de diseño real. Es el mayor freno. |
| JavaScript | 🟢 **Sí** | Bien modularizado en funciones `init*()`; solo necesita separarse en archivos y sacar datos a configuración. |
| Recursos (imágenes y video) | 🔴 **No** | Nombres sin convención, duplicados, imágenes 8 veces más grandes que su uso y ningún proceso de optimización. |
| Diseño visual | 🟡 **Parcial** | La identidad es coherente y cálida, pero se sostiene a mano: 127 colores hex, 160 sombras y 19 puntos de corte distintos. |
| Proceso (versionado, documentación) | 🔴 **No** | Esta copia no tiene historial de Git y la documentación describe una estructura que ya no existe. |

**Conclusión:** la base funciona hoy, pero **no escala**. Añadir una página, una sección o un cambio de marca cuesta cada vez más, porque cada ajuste se hace añadiendo CSS al final y copiando HTML entre páginas. No hace falta rehacer el sitio: el diseño, el contenido y el JavaScript se pueden conservar. Lo que hay que cambiar es **cómo se organiza** (sección 6).

---

## 1. Estructura del proyecto

### 1.1 Árbol actual y problemas

```text
landign-/
├── index.html                 1.566 líneas, 14 secciones
├── programas/                 5 páginas con cabecera propia, SIN pie ni main.js
├── sede-espinal/              1 página con cabecera de programa y pie propio
├── assets/
│   ├── css/styles.css         11.753 líneas · 239 KB (38 KB gzip)
│   ├── css/seasonal/          navidad.css (nuevo)
│   ├── js/                    main.js · analytics.js · seasonal.js
│   ├── img/{brand,hero,content,team,psicologia,"pantalla inicio"}
│   ├── semilla/{danza,futbol,ingles,patinaje,robotica,taekwondo}
│   ├── siembra/becados/       ← 4 archivos idénticos a assets/cosecha/
│   ├── cosecha/
│   ├── psicologia/            ← 2 archivos idénticos a assets/img/psicologia/
│   └── videos/                63 MB
├── informes/                  24 MB de PDF (uno de 19,5 MB)
└── docs/                      7 documentos Markdown
```

| # | Hallazgo | Evidencia | Por qué importa |
|---|----------|-----------|-----------------|
| E1 | **Dos criterios para organizar imágenes** | `assets/img/<tipo>/` convive con `assets/<programa>/` | No hay una regla clara de dónde va una foto nueva, y se duplican |
| E2 | **8 archivos duplicados** | Mismo hash MD5: `cosecha/*` = `siembra/becados/*`; `img/content/logro-cierre.jpg` = 2 copias; `duenos-hero-clean.jpg` ×2; `psicologia/1.jpg` = `img/psicologia/WhatsApp…` | Peso de despliegue y riesgo de actualizar una copia y no la otra |
| E3 | **5 archivos sin uso (0,9 MB)** | `img/pantalla inicio/dueños.jpg` (382 KB), `duenos-foto.jpg`, `duenos-hero-full.jpg` y las 2 fotos de `img/psicologia/` | Ninguna página, CSS ni JS las referencia |
| E4 | **26 archivos con espacios o tildes (22 `.jpeg` y 4 `.jpg`)** | `WhatsApp Image 2026-06-14 at 10.42.04 AM.jpeg`, carpeta `pantalla inicio`, `dueños.jpg`, `drirectora.jpg` | Las URL quedan con `%20`; las tildes y eñes fallan en algunos servidores; no se sabe qué muestra cada foto |
| E5 | **Esta copia no tiene historial de Git** | `.git/` está vacía (la carpeta está en `Descargas/Comprimidos`: parece un ZIP del repositorio) | Sin historial no hay vuelta atrás. Aplica los cambios en el clon real del repositorio, no en esta copia |
| E6 | **La documentación está desactualizada** | El árbol de `README.md` y `docs/CODIGO.md` no incluye `sede-espinal/`, `informes/`, `assets/semilla/`, `videos/` ni el chatbot | Quien llegue nuevo trabajará sobre un mapa equivocado |

### 1.2 Las páginas no comparten una plantilla

| Página | Cabecera | Menú a otras secciones | Pie | `main.js` | Google Fonts |
|--------|----------|------------------------|-----|-----------|--------------|
| `index.html` | `.site-header` (logo centrado, menú hamburguesa) | ✅ 13 enlaces | ✅ | ✅ | ✅ |
| `programas/index.html` | `.program-detail-header` (logo y "Volver") | ❌ | ❌ | ❌ | ❌ **(usa otra fuente)** |
| `programas/{semilla,siembra,cosecha,psicosocial}.html` | `.program-detail-header` | ❌ | ❌ | ❌ | ✅ |
| `sede-espinal/index.html` | `.program-detail-header` | ❌ | ✅ (distinto) | ❌ | ✅ |

**Consecuencias:**

- Cambiar el menú, el teléfono o el pie implica editar hasta 7 archivos a mano.
- Las páginas internas son **callejones sin salida**: sin pie, sin redes y sin WhatsApp. Sus botones ("Quiero participar") llevan de vuelta a `index.html#contacto` en lugar de dejar actuar desde ahí.
- `programas/index.html` no carga Google Fonts, así que sus títulos se ven con otra tipografía.
- En `sede-espinal/` el enlace superior dice "Volver a Sede Espinal": lleva a la sección de la sede en la portada, pero el texto hace pensar que se queda en la misma página.

---

## 2. Código

### 2.1 HTML

**Bien hecho**
- Una `h1` por página, secciones con `aria-labelledby`, enlace para saltar al contenido, `label` en todos los campos y `width`/`height` en las imágenes.
- SEO técnico completo: canonical, Open Graph, JSON-LD `NGO`, `sitemap.xml` (con las 7 URL) y `robots.txt`.
- `semilla.html` usa `<details>`/`<summary>` para las galerías: accesible y sin JavaScript.

**Para mejorar**

| # | Hallazgo | Detalle |
|---|----------|---------|
| H1 | Contenido de datos escrito dentro del maquetado | Equipo (4 tarjetas), informes (3 filas), línea de tiempo (4 hitos) y métricas: para añadir un informe hay que copiar unas 25 líneas de HTML y editar 6 sitios. Son datos, no diseño. |
| H2 | Número de WhatsApp repetido | 9 veces en `index.html`, 4 en `main.js` y 1 en `sede-espinal/` (14 en total). |
| H3 | Iconos SVG repetidos | Los SVG de WhatsApp, Instagram y Facebook están copiados en el pie y en los botones flotantes (unos 4 KB duplicados). |
| H4 | Iconos de programas con emoji | 🌱📚🏆🧠: cambian de aspecto según el sistema operativo y no siguen la marca. |

### 2.2 CSS: el problema central

Medido sobre `assets/css/styles.css`:

| Métrica | Valor | Referencia sana |
|---------|-------|-----------------|
| Líneas / peso | 11.753 / 239 KB (38 KB gzip) | Menos de 3.000 líneas para un sitio de 7 páginas |
| Bloques de reglas | 1.749 | — |
| Selectores distintos | 872 | — |
| **Bloques que redefinen un selector ya existente** | **877 (50 %)** | Cerca de 0 |
| Selectores más redefinidos | `.nav-list` ×30, `.logo-mark` ×27, `.nav-shell` ×25, `.hero` ×25, `.contact-card` ×24, `.menu-toggle` ×18 | 1–3 (base y variantes responsive) |
| `!important` | 545 | Menos de 10 (utilidades) |
| Reglas que no aplican a ningún elemento de ninguna página | 225 (14 %, unos 28 KB): `.hero-gallery-dots`, los selectores `img[src*="pantalla inicio"]`, `.report-card*`, `.team-grid`, `.trust-strip-card`… | 0 |
| Bloques `:root` | 5 (más la capa v47) | 1 |
| Variables definidas / usos de `var()` | 42 / 489 | — |
| Colores hex distintos | **127** | 15–25 en un sistema |
| `rgba()` distintos | **unos 360** (356–376 según cómo se normalicen los espacios) | — |
| `box-shadow` distintos | **unas 130–160** (las sombras de varias líneas se cuentan distinto) | 3–5 niveles |
| `border-radius` distintos | **45** | 3–4 |
| `font-size` distintos | **128** | Escala de 8–10 pasos |
| Puntos de corte (`@media`) | 105 consultas con **19 anchos distintos** (420, 480, 520, 560, 620, 640, 680, 700, 720, 760, 768, 820, 840, 860, 900, 960, 980, 1080, 1120) | 3–4 |
| Niveles de `z-index` | **26** (de −2 a 1230) | 6–8 con nombre |

**Cómo se llegó a esto:** los comentarios lo cuentan ("Navegación final…", "Navegación con presencia…", "Corrección de capas del menú…", "Pulido adaptivo final…"). Cada cambio se añadió al final para ganar la cascada, a veces con `!important`, en lugar de editar la regla original. Por eso hoy, para saber cómo se ve el menú, hay que leer 30 bloques repartidos en unas 7.000 líneas.

**Riesgos concretos**
- Cualquier cambio puede no verse porque otra regla posterior con `!important` gana. Eso empuja a añadir otro `!important` y el ciclo sigue.
- Cambiar el color de marca no es posible desde un único sitio: solo 42 variables frente a 503 colores escritos a mano.
- Las 6 páginas internas descargan los 239 KB completos, que incluyen chatbot, carrusel, libro 3D y formulario, aunque no los usan.

### 2.3 JavaScript

**Bien hecho**
- `SELECTORS` centralizado, una función `init*()` por funcionalidad y salidas tempranas si falta el elemento.
- `IntersectionObserver` para revelar elementos y para el menú activo; `requestAnimationFrame` para el scroll; listeners `passive`.
- Respeta "reducir movimiento" y "ahorro de datos", y limita las animaciones en equipos con poca memoria.
- Es seguro: el chatbot inserta el texto del usuario con `textContent` (sin riesgo de XSS).
- Analítica opcional y desactivada hasta poner un ID real.

**Para mejorar**

| # | Hallazgo | Detalle |
|---|----------|---------|
| J1 | Código muerto | `initHeroGallery()` (se ejecuta, pero no hace nada porque el hero tiene 1 sola foto; `.hero-slide` sí se usa), `SELECTORS.heroGalleryDots` y `SELECTORS.lazyVideo` (`.video-lazy` no existe), y la rama de `iframe` en `initLazyVideos()`. |
| J2 | Datos dentro de la lógica | Las respuestas del chatbot (teléfono, dirección, programas) están escritas en `main.js`: si cambia el número, hay que editarlo en JS y en HTML. |
| J3 | Un solo archivo para todo | Las 887 líneas de `main.js` cargan solo en la portada. Las páginas internas no cargan nada, así que si algún día necesitan el menú o el chatbot habrá que duplicar código. |
| J4 | Accesibilidad del libro de historia | `renderBook()` reemplaza todo el contenido dentro de un `aria-live="polite"`, así que el lector de pantalla vuelve a leer páginas enteras en cada clic. Además, las caras traseras ocultas siguen en el árbol de accesibilidad. |
| J5 | Puntos del carrusel de equipo de 12 × 9 px | Por debajo del mínimo de 24 × 24 px para tocar (WCAG 2.5.8). |

---

## 3. Diseño

### 3.1 Lo que funciona

- Identidad cálida y coherente con el logo: terracota, rosa, dorado y crema, más el contraste de Cormorant Garamond (títulos) con una sans legible (texto).
- Componentes reconocibles y repetidos: etiqueta pequeña, título y entradilla en cada sección; tarjetas de programa; línea de tiempo numerada en las páginas de programa.
- Sin desbordes horizontales en 390, 768, 1024 y 1440 px. El contenido se reorganiza bien en tablet.
- Después de las correcciones v47, axe no reporta errores en la portada, Programas ni Semilla.

### 3.2 Problemas

| # | Área | Hallazgo | Recomendación |
|---|------|----------|---------------|
| D1 | Jerarquía | En escritorio el primer pantallazo es **solo la foto**: nombre, propuesta de valor y botones quedan debajo del pliegue. | Foto a unos 60 % de la altura con el título superpuesto sobre un degradado, o una cuadrícula foto/texto 50/50. |
| D2 | Navegación | En 1440 px el menú sigue escondido tras la hamburguesa, y tiene 13 enlaces. | En escritorio, menú visible con 5–6 entradas (Fundación, Programas, Impacto, Transparencia, Contacto) y botón "Donar". Hamburguesa solo por debajo de unos 1024 px. |
| D3 | Longitud | 14 secciones: unos 15.900 px en escritorio y unos 19.500 px en móvil. "Testimonios" y "Videos" son ambas de video; "Actividades" y "Momentos" son ambas galerías. | Unir Testimonios con Videos ("Historias") y Actividades con Momentos, o mover una a una página interna. |
| D4 | Sistema visual | Ver la tabla 2.2: 127 colores, 130–160 sombras, 45 radios, 128 tamaños de letra. A simple vista se nota en radios de 4, 8, 12, 18, 20, 22, 24, 32 y 34 px entre tarjetas similares. | Definir tokens (sección 6.2) y usar solo esos. |
| D5 | Elementos flotantes | En móvil hay 4 botones fijos a la vez (chatbot, WhatsApp, Instagram y Facebook), más la flecha de volver arriba, que tapan contenido y botones. | Un solo botón "Contacto" que despliegue WhatsApp, redes y chat. |
| D6 | Páginas internas | Sin pie ni redes, y su CTA lleva a otra página. | Plantilla común con pie y un CTA directo a WhatsApp con mensaje según el programa. |
| D7 | Contraste en `sede-espinal/` | El texto del pie (`.footer-copy`) tiene 2,83:1 (mínimo 4,5:1). | Usar el mismo pie que la portada. |
| D8 | 320 px | No aparece scroll horizontal porque `.program-page` y el `body` tienen `overflow: hidden`, pero **el contenido se recorta sin aviso**: `.sede-espinal-visual` (4/3 con alto mínimo de 240 px, o sea 320 px de ancho) y `.timeline-media--portrait` en la portada; `.sede-info-grid` (+41 px) y `.program-detail-card` (+63 px) en la sede. | Quitar `aspect-ratio` cuando hay alto mínimo y poner `min-width: 0` en los hijos de la cuadrícula. |
| D9 | Iconografía | Emojis en programas y contacto. | Un set SVG propio de trazo uniforme. |

---

## 4. Rendimiento

| Métrica | Valor medido | Comentario |
|---------|--------------|------------|
| Carga inicial de la portada (sin fuentes) | **13 peticiones · unos 2,2 MB** | Las 5 fotos de "Actividades" se descargan al inicio por estar cerca del hero |
| Tras recorrer toda la portada | 26 peticiones · unos 3,2 MB | Sin contar videos, que se cargan al pulsar |
| Imágenes más de 2 veces más grandes que su tamaño en pantalla | **15–16** | Las de actividades miden 1800 px y se muestran a 223–320 px (unas 8 veces más) |
| Imágenes JPEG de más de 300 KB | 7 (hasta 636 KB) | — |
| CSS que bloquea el pintado | 239 KB (38 KB gzip) en un solo archivo, también en las páginas que no usan ni un 20 % | — |
| Fuentes | 8 archivos (Cormorant ×3 pesos, Inter ×5 pesos) | Bastan unos 4: Cormorant 600 y 700, Inter 400 y 700 |
| Videos | 63 MB (`conoce-nuestra-mision.mp4` 24 MB) | Bien cargados bajo demanda, pero conviene comprimir a unos 2–4 Mbps |
| Informes | `INFORME-…-2025.pdf` de 19,5 MB | Pesado para móvil: comprimir o enlazar una versión ligera |

**Ganancia estimada al optimizar imágenes:** generar versiones de 480, 800 y 1200 px en WebP con `srcset` bajaría la carga inicial de unos 2,2 MB a unos 400 KB.

---

## 5. Lo que ya está bien y hay que conservar

1. La organización de `main.js` en funciones `init*()` con `SELECTORS`.
2. La carga diferida de videos con póster y botón.
3. Las galerías con `<details>` de Semilla.
4. El SEO técnico y los datos estructurados.
5. La paleta, las fuentes y el tono cálido de los textos.
6. El sistema de temporadas (`seasonal.js` + `seasonal/navidad.css`): ya sigue el patrón al que debería migrar el resto (archivo aislado, activado por un atributo y sin `!important` salvo para ganar a la deuda existente).

---

## 6. Arquitectura recomendada

### 6.1 Estructura objetivo

Para un sitio de 7–15 páginas mantenido por pocas personas, la opción más sencilla que resuelve la duplicación es un **generador de sitios estáticos** con plantillas parciales. **Eleventy (11ty)** encaja mejor que un framework: el HTML sigue siendo HTML, no hay JavaScript en el navegador por usarlo y el resultado se publica igual en GitHub Pages. Astro es una buena alternativa si se prefiere trabajar con componentes.

```text
fundacion/
├── src/
│   ├── _data/                   ← CONTENIDO como datos
│   │   ├── site.json            nombre, WhatsApp, correo, dirección, redes (UNA vez)
│   │   ├── programas.json       Semilla, Siembra, Cosecha, Psicosocial
│   │   ├── equipo.json
│   │   ├── informes.json        añadir un informe = 4 líneas
│   │   └── momentos.json
│   ├── _includes/
│   │   ├── layouts/base.njk     <head>, header, footer, scripts (UNA vez)
│   │   ├── layouts/programa.njk plantilla de las 4 páginas de programa
│   │   └── partials/            header, footer, social-dock, chatbot, cta-whatsapp, icon
│   ├── index.njk
│   ├── programas/*.njk
│   └── sede-espinal.njk
├── assets/
│   ├── css/
│   │   ├── main.css             @layer tokens, base, layout, components, sections, utilities, seasonal;
│   │   ├── tokens.css           único :root
│   │   ├── base.css             reset, tipografía, foco, .sr-only, .container
│   │   ├── layout/              header.css, footer.css, section.css, grid.css
│   │   ├── components/          button, card, badge, carousel, form, timeline, chatbot…
│   │   ├── sections/            hero, historia, impacto, informes, contacto…
│   │   └── seasonal/navidad.css
│   ├── js/
│   │   ├── main.js              importa y arranca módulos según la página
│   │   ├── modules/             menu.js, reveal.js, scroll-state.js, team-slider.js,
│   │   │                        story-book.js, chatbot.js, lazy-video.js, contact-form.js
│   │   ├── seasonal.js
│   │   └── analytics.js
│   ├── img/                     originales con nombres descriptivos (kebab-case, sin tildes)
│   │   └── programas/semilla/futbol-entrenamiento-01.jpg …
│   └── icons/sprite.svg         WhatsApp, Instagram, Facebook e iconos de programas
├── informes/
└── .eleventy.js                 + plugin de imágenes: WebP/AVIF y srcset automáticos
```

**Qué se gana:**

| Tarea | Hoy | Con la estructura objetivo |
|-------|-----|----------------------------|
| Cambiar el número de WhatsApp | 14 ediciones en 3 archivos | 1 línea en `site.json` |
| Añadir un informe | Copiar unas 25 líneas de HTML | 4 líneas en `informes.json` |
| Cambiar el menú o el pie | Hasta 7 archivos | 1 parcial |
| Añadir un programa | Copiar una página y adaptar las rutas `../` | 1 entrada de datos más la plantilla `programa.njk` |
| Saber cómo se ve un botón | Buscar `.btn` en 11.700 líneas | `components/button.css` |
| Cambiar el color de marca | Imposible desde un sitio | 1 token |
| Optimizar fotos | Manual | Automático al compilar |

> Si no se quiere añadir un generador todavía, el paso intermedio es aplicar la parte CSS y JS de esta estructura (6.2 y 6.3) y mantener el HTML a mano.

### 6.2 Sistema de diseño (tokens)

> **Implementado en `assets/css/tokens.css` (v50, HU5)** con los valores que hoy se aplican, que son los de los 6 `:root` antiguos fusionados (el último gana). Difiere de esta propuesta en `--color-accent-700` (`#bb5369`), en los radios (`--radius-sm` 8, `--radius-md` 12, `--radius-lg` 32 + `--radius-pill`) y en que mantiene alias para los nombres antiguos (`--orange`, `--pink`…).

Un único `:root`, en una capa de cascada, con solo lo necesario:

```css
@layer tokens {
  :root {
    /* Color: marca */
    --color-brand-500: #c96f4a;  --color-brand-700: #a75435;   /* terracota (botones: 700) */
    --color-accent-500: #d96f84; --color-accent-700: #b84a62;  /* rosa */
    --color-gold-400: #e5b85c;
    /* Color: neutros */
    --color-ink: #24211f; --color-muted: #68625d;
    --color-surface: #ffffff; --color-surface-warm: #fffaf3; --color-line: rgb(0 0 0 / .08);
    /* Color: estados */
    --color-whatsapp: #15803d;

    /* Tipografía */
    --font-title: "Cormorant Garamond", Georgia, serif;
    --font-body: "Inter", "Segoe UI", system-ui, sans-serif;
    --text-xs: .75rem; --text-sm: .875rem; --text-base: 1rem; --text-lg: 1.125rem;
    --text-xl: clamp(1.25rem, 1.6vw, 1.5rem);
    --text-2xl: clamp(1.75rem, 3vw, 2.25rem);
    --text-3xl: clamp(2.25rem, 4.5vw, 3.5rem);
    --text-4xl: clamp(2.75rem, 6vw, 4.75rem);

    /* Espaciado (escala de 4 px) */
    --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-6: 24px;
    --space-8: 32px; --space-12: 48px; --space-16: 64px; --section-y: clamp(56px, 8vw, 104px);

    /* Forma y profundidad */
    --radius-sm: 8px; --radius-md: 14px; --radius-lg: 24px; --radius-pill: 999px;
    --shadow-1: 0 4px 14px rgb(56 37 24 / .07);
    --shadow-2: 0 14px 34px rgb(56 37 24 / .10);
    --shadow-3: 0 28px 64px rgb(56 37 24 / .16);

    /* Capas */
    --z-base: 1; --z-sticky: 100; --z-float: 500; --z-overlay: 900; --z-header: 1200; --z-modal: 1300;
  }
}
/* Puntos de corte (en @media no se pueden usar variables; documentarlos y usar SOLO estos):
   sm 560px · md 840px · lg 1080px */
```

Los 19 puntos de corte pasan a 3; los 26 niveles de `z-index`, a 6 con nombre; las 130–160 sombras, a 3; los 45 radios, a 4.

### 6.3 JavaScript en módulos

```js
// assets/js/main.js  (cargar con <script type="module">)
import { initMenu } from "./modules/menu.js";
import { initReveal } from "./modules/reveal.js";
// …
const modules = {
  "#nav-list": () => initMenu(),
  ".reveal": () => initReveal(),
  "[data-story-book]": () => import("./modules/story-book.js").then((m) => m.initStoryBook()),
  "#chatbotToggle": () => import("./modules/chatbot.js").then((m) => m.initChatbot())
};
// Cada página arranca solo lo que contiene; lo pesado se carga bajo demanda.
Object.entries(modules).forEach(([selector, init]) => document.querySelector(selector) && init());
```

Las respuestas del chatbot y el teléfono se leen de un `<script type="application/json" id="site-data">` generado desde `site.json`.

### 6.4 Riesgos de la migración

| # | Riesgo | Cómo evitarlo |
|---|--------|---------------|
| R1 | **Las capas `@layer` pierden contra el CSS sin capa.** Durante la migración, el `styles.css` antiguo seguirá sin capa y ganará siempre a todo lo nuevo. Además, dentro de las capas los `!important` invierten la prioridad. | Envolver el CSS antiguo en `@layer legacy` con este orden: `@layer tokens, legacy, base, layout, components, sections, utilities;`. **`tokens` va antes de `legacy`**: si fuera después, sus variables anularían las que redefine la temporada navideña (`--pink`, `--yellow`). `navidad.css` va en la misma capa `legacy` hasta retirar sus `!important`. Ir sacando bloques de `legacy` a su capa. ✅ Hecho en v50. |
| R4 | **Navegadores sin `@layer`** (Chrome < 99, Safari < 15.4, de 2022) ignoran todo lo que está dentro de una capa: verían el sitio sin estilos. | Riesgo aceptado: son menos del 1 % del tráfico web. Si la analítica muestra lo contrario, quitar la envoltura `@layer legacy` (no cambia nada visible). |
| R2 | **Los módulos ES no funcionan abriendo el archivo con doble clic.** `<script type="module">` no carga en `file://`, y Eleventy añade un paso de compilación. | Indicar en el README que hace falta un servidor local (`npx serve`) y publicar con un GitHub Action que compile. |
| R3 | **`innerHTML` con datos editables.** Las respuestas del bot se pintan con `innerHTML`, que hoy es seguro porque son texto fijo. Si pasan a un JSON que edita otra persona, se podría inyectar código. | Construir los enlaces del bot con nodos DOM (`createElement` + `textContent`) antes de mover las respuestas a datos. ✅ Hecho en HU9. |

---

## 7. Hoja de ruta priorizada

Impacto: **A**lto, **M**edio, **B**ajo. Esfuerzo: **S** (horas), **M** (1–2 días), **L** (varios días).

### Fase 0 · Preparar (antes de tocar nada)

| # | Acción | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 0.1 | Trabajar en el **clon con Git** del repositorio (esta copia no tiene historial) y crear una rama `refactor/estructura` | A | S |
| 0.2 | Capturas de referencia de las 7 páginas en 390, 768 y 1440 px para comparar después de cada paso | A | S |

### Fase 1 · Ganancias rápidas (sin cambiar la arquitectura)

| # | Acción | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 1.1 | Optimizar imágenes: WebP de 480, 800 y 1200 px con `srcset`/`sizes` (carga inicial de unos 2,2 MB a unos 400 KB) | A | S |
| 1.2 | Renombrar recursos sin espacios ni tildes, borrar los 8 duplicados y los 5 sin uso (unos 1,5 MB) | M | S |
| 1.3 | Comprimir el PDF de 2025 (19,5 MB) y los videos | M | S |
| 1.4 | Cargar Google Fonts en `programas/index.html` y reducir a 4 pesos | M | S |
| 1.5 | Corregir el contraste del pie de la sede, el contenido recortado en 320 px y los puntos del carrusel de 24 px | M | S |
| 1.8 | Accesibilidad del libro de historia (J4, antes 3.6): anunciar solo "Página X de Y" y ocultar con `inert` las caras no visibles | M | S |
| 1.6 | Borrar el JS muerto (J1) y las 225 reglas CSS sin uso | B | S |
| 1.7 | Actualizar `README.md` y `docs/CODIGO.md` con la estructura real | M | S |

### Fase 2 · Diseño y conversión

| # | Acción | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 2.1 | Hero con mensaje y CTA visibles en el primer pantallazo (D1) | A | M |
| 2.2 | Menú visible en escritorio con 5–6 entradas y botón "Donar" (D2) | A | M |
| 2.3 | Pie y CTA de WhatsApp por programa en las páginas internas (D6) | A | S |
| 2.4 | Agrupar los botones flotantes en móvil (D5) | M | M |
| 2.5 | Unir secciones redundantes de la portada (D3) | M | M |
| 2.6 | Iconos SVG propios en lugar de emojis (D9) | B | M |

### Fase 3 · Estructura escalable

| # | Acción | Impacto | Esfuerzo |
|---|--------|---------|----------|
| 3.1 | Crear `tokens.css` con el sistema 6.2 y reemplazar colores, sombras y radios sueltos | A | M |
| 3.2 | Dividir `styles.css` por componente/sección con `@layer`, empezando por `@layer legacy` (ver R1). Por cada selector repetido, conservar solo el valor que hoy se ve y borrar el resto, sección por sección, comparando con las capturas de 0.2 | A | L |
| 3.3 | Eliminar los `!important` a medida que cada bloque queda consolidado (objetivo: menos de 10) | A | (incluido en 3.2) |
| 3.4 | Separar `main.js` en módulos ES (6.3) y sacar los datos de contacto a configuración | M | M |
| 3.5 | Migrar a Eleventy: `base.njk`, parciales y `_data/*.json` (6.1) | A | L |

**Orden sugerido:** 0 → 1 → 2.1–2.3 → 3.1 → 3.2 (por secciones, empezando por header/menú, que es lo más fragmentado) → 3.4 → 3.5 → resto.

**Criterios para dar la refactorización por terminada:**
- `styles.css` dividido; ningún selector definido más de 2 veces (base y una consulta `@media`).
- Menos de 10 `!important`; solo 3 puntos de corte.
- WhatsApp, teléfono, correo y dirección definidos en un único archivo.
- Capturas antes y después sin diferencias visuales no buscadas.
- axe sin errores en las 7 páginas.

---

## 8. Estado de aplicación (v48)

Aplicado el 18-11-2026 sobre esta copia. Respaldo previo en `_respaldo-2026-11-18-v47/` (HTML, CSS, JS y docs) y archivos retirados en `_respaldo-2026-11-18-v47/assets-retirados/`.

| # | Estado | Qué se hizo |
|---|--------|-------------|
| 1.1 | ✅ | 53 imágenes únicas convertidas a WebP (480, 960 y 1600 px como máximo) en `assets/img/opt/`, con `srcset` y `sizes` medidos en 72 etiquetas `<img>` y en los fondos del CSS. Carga inicial de la portada: **2,2 MB → unos 800 KB** en escritorio y **unos 600 KB** en móvil, fuentes incluidas. Los originales se conservan como fuente; `og:image` y el favicon siguen en JPEG. |
| 1.2 | 🟡 | Retirados los 5 archivos sin uso y la copia de `pantalla inicio/` (0,9 MB). Las páginas ya usan nombres limpios de `assets/img/opt/`; los originales con espacios quedan solo como fuente. `cosecha/` y `siembra/becados/` comparten ahora un único WebP. |
| 1.3 | ❌ | Sin hacer: no hay herramientas de compresión de PDF ni de video en este equipo (Ghostscript, ffmpeg). |
| 1.4 | ✅ (HU15) | Google Fonts pide 4 pesos en vez de 8: Cormorant Garamond 700 e Inter 400, 700 y 800. Se midió el peso calculado de todos los elementos y pseudo-elementos, visibles u ocultos, de las 7 páginas (390 y 1440 px, con y sin Navidad, con el chat abierto y los errores del formulario): ninguno pide 500 ni 600 (las dos reglas que los declaraban quedan pisadas). Los pesos que sí se piden (650, 720, 750, 850, 900) caen en la misma cara que antes, así que el aspecto no cambia. El CSS de Google Fonts baja de 18,4 KB a 9,5 KB. |
| 1.5 | ✅ | Pie de las páginas internas con contraste 11,7:1; recortes de 320 px corregidos; área táctil de 24 × 24 px en los puntos del carrusel. |
| 1.6 | 🟡 | JS muerto borrado (`initHeroGallery`, `heroGalleryDots`, `lazyVideo` y la rama de `iframe`). Las 225 reglas CSS sin uso quedan para 3.2. |
| 1.7 | ✅ | `README.md` actualizado. |
| 1.8 | ✅ | Libro de historia: "Página X de Y" es el único anuncio (`role="status"`) y solo las 2 caras visibles son accesibles (`inert` en el resto). |
| 2.1 | ✅ | Desde 1024 px el hero mide `clamp(340px, 42svh, 500px)`: en 1440 × 900 el título y los botones entran en el primer pantallazo, y la foto ya no se amplía por encima de su tamaño real. |
| 2.3 | ✅ | Las 5 páginas de programas y la sede tienen pie común (Fundación, Programas, Transparencia, Contacto y WhatsApp). Sus CTA abren WhatsApp con un mensaje según el programa y registran un evento de analítica. "Volver a Sede Espinal" pasa a "Volver a la portada". |
| H2/J2 | 🟡 | En `main.js` el número está en una sola constante `CONTACT`. En el HTML sigue repetido hasta tener plantillas (3.5). |
| 2.2 | ✅ (v49, HU4) | Desde 1080 px el menú queda visible con 6 entradas (Fundación, Sede Espinal, Programas, Impacto, Contacto, Informes) y botón "Donar" a WhatsApp; el logo pasa a la izquierda. Por debajo sigue la hamburguesa con los 13 apartados y "Donar" al final. |
| 2.4 | ✅ (v49, HU4) | En móvil, un solo botón de contacto despliega WhatsApp, Instagram, Facebook y el asistente; se cierra con Escape o al tocar fuera. El dock oculto junto a Contacto ya no recibe foco (`visibility: hidden`). |
| 3.1 | 🟡 (v50, HU5) | `tokens.css` con un único `:root`: los 6 bloques `:root` de `styles.css` se unificaron con sus valores finales; los nombres antiguos quedan como alias. 84 `border-radius: 999px` pasan a `var(--radius-pill)`. Falta reemplazar los 127 colores y las sombras sueltas. |
| 3.2 | 🟡 (v50, HU5) | Primer paso hecho: `styles.css` y `navidad.css` dentro de `@layer legacy` (R1). Verificado: el estilo calculado de cada elemento y pseudo-elemento de las 7 páginas (390/1440 px, con y sin Navidad) es idéntico al de antes. Falta mover bloques a sus capas y borrar duplicados. |
| 3.1 | 🟡 (v51, HU6) | Colores y radios escritos a mano que coinciden **exactamente** con un token pasan a `var()`: 48 colores hex y 37 `border-radius` (8, 12 y 32 px). Nuevo token `--color-white` para texto e iconos sobre fondos de color. Quedan 108 colores hex distintos (183 usos), los `rgba()` y las sombras sin token: unificarlos cambia el aspecto y hay que decidirlo con capturas. |
| 3.2 | 🟡 (v51, HU6) | Borradas **1.347 declaraciones muertas** (siempre pisadas por una regla posterior con el mismo selector, el mismo contexto `@media`/`@supports` y la misma o mayor importancia) y las 307 reglas que quedaron vacías. Se conservan los duplicados dentro de una misma regla y los que usan `svh`/`dvh`, `color-mix()` o `env()`, porque suelen ser alternativas para navegadores antiguos. `styles.css`: 11.916 → 9.524 líneas, 578 → 416 `!important`. |
| A11y | ✅ (v51, HU6) | axe-core 4.10 (WCAG 2.1 A/AA) vuelto a ejecutar en las 7 páginas. Corregidos: los carruseles de actividades y del equipo no se podían desplazar con el teclado (`role="region" tabindex="0"`), y `aria-label` no permitido en `#site-chatbot` (`role="region"`). Los avisos de contraste en los `.eyebrow` son falsos positivos de la animación de entrada: con las animaciones terminadas no aparecen. |
| 1.6 | ✅ (v52, HU7) | Borrados 202 selectores CSS que no pueden aplicarse a ningún elemento, porque usan una clase, id o atributo que no aparece en ningún HTML ni JS del sitio (`.testimonial-card`, `.team-card`, `.report-card*`, `.hero-gallery-dots`, `.video-lazy`, `img[src*="pantalla inicio"]`…), y las 155 reglas que quedaron vacías. Se tratan como usadas las clases que `main.js` arma con plantillas (`story-book-face--*`, `chatbot-message--*`, `#*-error`). `styles.css`: 9.524 → 8.379 líneas, 416 → 413 `!important`. Verificado igual que HU6: estilo calculado idéntico al de `dev`. |
| R3 | ✅ (HU9) | El chatbot ya no usa `innerHTML`: cada respuesta es una lista de partes (texto o enlace `{ text, href }`) y `appendMessage` las arma con `createElement` y `textContent`. Verificado: los 13 mensajes de una conversación de prueba dan el mismo HTML que en `dev`, y un mensaje con `<img onerror>` se muestra como texto. Las respuestas ya se pueden mover a un archivo de datos (3.4) sin riesgo de inyección. |
| 3.1 colores | ✅ (v53, HU8) | 9 tokens nuevos con los valores que ya usaba el sitio (`--color-green-900`, `--color-green-950`, `--color-brown-800`, `--color-media-bg`, `--color-media-dark`, `--color-surface-paper`, `--color-slate-700`, `--color-slate-600`, `--color-accent-800`) y 59 colores sueltos de `styles.css` pasan a `var()`. Los casi iguales a un token (ΔE ≤ 2,3, imperceptible) se fusionan con él, por ejemplo `#fffaf4` → `--color-surface-cream` y `#62676b` → `--color-slate-600`. Verificado: solo cambian esos colores. Quedan sin token los colores de un solo uso y los del chatbot y el lomo del libro, que son de un solo componente. |
| 3.1 radios | ✅ (v53, HU8) | Escala de 4 radios más la píldora: `--radius-sm` 8 px, `--radius-md` 12 px, `--radius-lg` 22 px (nuevo valor) y `--radius-xl` 32 px (el antiguo `--radius-lg`). 94 radios sueltos (4, 7, 10, 14, 16, 18, 20, 22, 24, 26, 28 y 30 px) pasan al escalón más cercano, con un cambio máximo de 4 px. En las capturas antes/después cambian de 0 a 598 píxeles por página: imperceptible. Verificado: solo cambian los radios.
| 3.1 sombras | ✅ (v53, HU8) | Escala de profundidad aprobada: `--shadow-1` (sutil), `--shadow-2` (tarjetas) y `--shadow-3` (paneles flotantes). 48 sombras neutras sueltas pasan al nivel según su desenfoque (≤ 24 px, ≤ 50 px, más). Se conservan 55 que son efectos (brillos de color de botones, sombras interiores y anillos). En las páginas internas no cambia ningún píxel; en la portada, algunas tarjetas quedan un poco más suaves. Las sombras con nombre anteriores (`--shadow-sm`, `--shadow-3d`…) siguen en uso y se migran en 3.2.
| 3.3 | 🟡 (v53, HU8) | Quitados **113 `!important`** que no deciden nada (413 → 300 en `styles.css`). Una declaración pierde su `!important` solo si ninguna otra de la misma familia de propiedad que pueda aplicarse al mismo elemento cambiaría de ganadora (según especificidad y orden, contando `navidad.css`, los estilos en línea del HTML y los que pone `main.js`); los estados que no se ven al cargar (`:hover`, `.is-open`, `[aria-expanded]`…) se tratan como posibles. Verificado: estilo calculado igual en las 7 páginas a 320, 390, 768, 1024 y 1440 px, con y sin Navidad, al cargar, con scroll, con el menú abierto y con chatbot, contacto, libro, `<details>` y formulario abiertos. Los 300 restantes sí compiten con otra regla: se irán al consolidar cada sección (3.2).
| 3.5 compilación | ✅ (HU10) | Eleventy 3.1.8 compila `src/` en `_site/` (`npm run build`; `npm start` abre un servidor local). Las páginas pasan a `src/` sin cambiar su URL (`permalink` global con `.html`) y `assets/`, `informes/`, `robots.txt`, `sitemap.xml`, `site.webmanifest` y `.nojekyll` se copian tal cual. `vercel.json` le indica a Vercel compilar y publicar `_site/`. Verificado: las 7 páginas generadas son idénticas byte a byte a las de v53 (salvo el BOM inicial de `index.html`, que Eleventy quita) y se publican exactamente los mismos archivos. |
| 3.5 plantillas | ✅ (HU10) | `src/_includes/layouts/interna.njk` tiene el `<head>`, la cabecera y el pie de las 6 páginas internas; cada página solo guarda su `<main>` y un encabezado con título, descripción, ruta canónica, clase del `body` y enlace de volver. `src/_data/site.json` reúne WhatsApp, correo, Instagram, Facebook y las versiones de caché de los 6 CSS/JS. Los 26 enlaces de WhatsApp se escriben con el mensaje legible (`{{ 'Hola, quiero…' | whatsapp }}`) y el filtro lo codifica. Verificado: las 7 páginas generadas son iguales a las de v53 salvo espacios en blanco (`diff -wB` vacío), y al cambiar el número en `site.json` cambian los 26 enlaces y no queda el anterior en ningún HTML. |
| H2 | ✅ (HU10) | El número de WhatsApp, el correo y las redes están una sola vez en el HTML (`site.json`). |
| 3.4 | ✅ (v9 de `main.js`, HU10) | `main.js` (877 líneas) pasa a módulos ES: `modules/config.js` (selectores, preferencias de movimiento y contacto) y un módulo por funcionalidad (`menu`, `hero`, `active-section`, `reveal`, `scroll-state`, `contact-form`, `team-slider`, `lazy-videos`, `story-book`, `chatbot`, `floating-contact`, `meta`). El código de cada `init*` se copió sin cambios (comprobado línea a línea) y `main.js` los arranca en el mismo orden. El número de WhatsApp ya no está en el JS: lo lee de `<script type="application/json" id="site-data">`, que Eleventy genera desde `site.json`. Verificado con el sitio servido por HTTP en 390 y 1440 px, comparado con v53: mismas respuestas del menú, scroll, libro, botón de contacto, chatbot (11 mensajes con sus enlaces), formulario válido y vacío y video, sin errores de JS; estilos calculados de las 7 páginas iguales salvo la animación de entrada del hero, que también varía al comparar v53 consigo misma. R2 aceptado: abrir el HTML con doble clic ya no sirve (`npm start`). |
| J2, J3 | ✅ (HU10) | Datos de contacto fuera de la lógica (J2) y un archivo por funcionalidad (J3). |
| 3.2 | 🟡 (v54, HU11) | **158 reglas fusionadas** con otra del mismo selector y el mismo contexto (`@layer`/`@media`): 1.197 → 1.039 reglas, 8.379 → 7.899 líneas; los selectores repetidos bajan de 139 a 42. Una regla se junta con la siguiente (o al revés) solo si ninguna declaración que quede entre las dos puede cambiar de ganadora: misma familia de propiedad (`font` cuenta con `line-height`), mismo pseudoelemento, misma importancia y misma especificidad, y que pueda aplicarse al mismo elemento según el DOM real de las 7 páginas servidas por HTTP con el JS ejecutado y el menú, chatbot, libro, `<details>` y formulario abiertos. Las 49 parejas que no cumplen se quedan separadas. Verificado: estilo calculado de todos los elementos y sus `::before`/`::after` en las 7 páginas a 320, 390, 768, 1024 y 1440 px, con y sin Navidad, al cargar, con scroll, con el menú abierto y con todo abierto (280 configuraciones): las únicas diferencias son las mismas que aparecen al comparar v53 consigo misma (redondeos de 0,02 px, animaciones de entrada y la altura de `#actividades`, que varía sola). |
| 3.3 | 🟡 (v55, HU11) | Con las reglas ya fusionadas se quitaron **109 `!important` más** (297 → 188), con el mismo criterio de HU8 pero ahora contra el DOM del sitio servido por HTTP (con los elementos que crea el JS). Se repitió hasta que no quedó ninguno por quitar: al quitar uno, a veces otro deja de competir. Verificado igual que la fusión (280 configuraciones): ninguna diferencia nueva frente al ruido de v53 consigo misma. Los 188 restantes sí deciden qué estilo se ve; quitarlos exige reescribir selectores, sección por sección. |
| 2.1 | ✅ (v56, HU13) | También en móvil y tableta (hasta 1023 px) el hero muestra la foto en su proporción (868 × 606) y no a pantalla casi completa: a 390 × 844 el título pasa de y ≈ 990 a y ≈ 531 px y entra en la primera pantalla. Se borraron 3 reglas muertas que buscaban la imagen por el nombre de archivo «pantalla inicio». |
| 2.4 | ✅ (v56, HU13) | Cambia el criterio de HU4 tras la crítica de diseño: un solo botón flotante de WhatsApp, a un toque en todos los tamaños (antes había que desplegarlo en móvil). Instagram y Facebook quedan solo en el pie; el asistente va a la izquierda con el color de marca (antes era el único morado del sitio). Se borró `floating-contact.js`. La nieve navideña baja a 14 copos en escritorio y 6 en móvil, con opacidad 0,35–0,65. |
| HU13 | ✅ (v56) | Crítica de diseño (impeccable, dos evaluaciones independientes: 28/40). Arreglos de aspecto y técnicos, sin tocar textos ni el orden de las secciones: <br>• **Botones:** tres tipos — `.btn-pink` (donar o apoyar), `.btn-whatsapp` y `.btn-secondary`; se borraron `.btn-orange` y `.btn-outline`. En el hero, «Conocer programas» pasa a enlace de texto (dos botones, no tres). <br>• **Menú:** las mismas 6 entradas en todos los tamaños (se borraron los 7 `<li class="nav-item--extra">` que solo veía el móvil) y «Donar» va primero en el HTML: encabeza el panel móvil y en escritorio sigue al final (`order: 99`). Al abrir el menú el foco pasa a «Donar» y Escape lo devuelve al botón. Las páginas internas tienen «Donar» en la cabecera. <br>• **Contraste AA:** textos de ejemplo del formulario, números de la línea de tiempo, resumen y etiquetas de informes, enlaces de las tarjetas de programa, etiqueta «Ruta visual» y cifra destacada. Nuevo token `--color-accent-900`. <br>• **Accesibilidad:** h2 oculto «Etapas del programa» en los 4 programas (pasaban de h1 a h3); los puntos del carrusel miden 24 × 24 px (WCAG 2.5.8); el resumen de informes deja de ser `<aside>` anidado y el botón de WhatsApp sí es un `<aside>` de primer nivel. <br>• Con Navidad, la insignia de campaña reemplaza a la de ubicación. Se quitó la nota de maqueta publicada «Espacio ideal para eventos…». <br>**Verificación:** axe (WCAG 2.2 AA + buenas prácticas) sin violaciones en las 7 páginas a 390 y 1440 px, con y sin Navidad; 70 combinaciones (7 páginas × 320/390/768/1024/1440 × temporada) sin errores de JS, desbordes ni imágenes rotas, con el WhatsApp flotante, el chat y «Donar» probados. |
| 2.5 | ✅ (v57, HU14) | Contenido de la portada reorganizado sin inventar datos: <br>• «Historias en video» (`#videos`) se unió a Testimonios; sus dos videos van debajo de los testimonios y el pie enlaza a `#testimonios`. <br>• Informes va antes de Contacto (primero la prueba, luego la petición). <br>• Las cifras (19 años, 4.200+, 65+) quedan solo en Impacto; se borraron las del hero y su CSS. <br>• Los textos «Un espacio para…» pasan a frases directas. <br>• «Diciembre 2026 · Cierre y logros» se presentaba como logro antes de ocurrir: ahora es «próximamente», en futuro. <br>Queda para la fundación: una página de donación con montos y medios de pago (Nequi, cuenta), que necesita datos reales. |
| 2.6 | ✅ (HU18) | Ya no queda ningún emoji en el sitio. Los íconos de Programas se quitaron porque en el rediseño cada programa es una pantalla con su foto. Contacto usa SVG de trazo uniforme (ubicación, teléfono, correo) y Sede Espinal ya no lleva íconos. |
| HU18 | ✅ (sitio v1) | **Rediseño completo: «Una historia por pantalla».** Se eligió con impeccable: `PRODUCT.md` con el usuario y un sorteo de direcciones en dos rondas (el usuario pidió la tanda más atrevida y eligió esta). Cada sección es una pantalla con foto real a sangre, la leyenda abajo a la izquierda y un carril de acciones a la derecha (Donar, WhatsApp, Programas, Compartir y Asistente). Arriba va un indicador segmentado que se llena con el scroll. Fondo casi negro, rosa del logo como único color de estado, amarillo solo para cifras. Títulos en Big Shoulders Display y texto en Schibsted Grotesk, servidas desde el sitio (ya no se carga Google Fonts). Programas: una pantalla por programa, cruzadas por la franja del acompañamiento psicosocial. Libro de historia convertido en visor de una página a la vez. Carruseles de una pieza dominante. Se conserva todo el texto, las imágenes, el logo y la información de los programas; solo se quitó la portada del libro, que repetía el título de la sección. <br>**CSS:** `sitio.css` (unas 850 líneas en capas) reemplaza a `tokens.css` y `styles.css` (unas 7.900 líneas, 186 `!important`); quedan 3 `!important` (`[hidden]` y movimiento reducido). Esto cierra 3.1, 3.2 y 3.3. Se borraron `hero.js` y `motion-fx.js`; nuevo `historias.js`; `story-book.js` reescrito. <br>**Verificación:** 70 combinaciones (7 páginas × 320/390/768/1024/1440 × con y sin Navidad) sin errores, desbordes ni imágenes rotas; axe WCAG 2.2 AA + buenas prácticas sin violaciones; contraste del texto sobre fotos medido por píxeles (AA); detector de impeccable sin hallazgos pendientes salvo el adorno navideño SVG preexistente; revisión final independiente con una ronda de correcciones. |
| HU19 | ✅ (sitio v2) | **Estilo «presentación de marca».** Sigue la referencia que dio el usuario (una web de lanzamiento de autos) con la identidad de la fundación. Se mantienen todo el texto, las imágenes, el logo, los colores del logo y todos los enlaces. <br>**Qué cambia:** pantalla de entrada «AMIGOS (Entrar) COMO ARROZ» (una vez por sesión, nunca con enlace a sección); inicio con la foto enmarcada; secuencia de palabras fija con el scroll; capítulos numerados en Space Mono; Fundación y programas con foto enmarcada al lado; Sede Espinal a sangre con ESPINAL gigante; Momentos en sección clara; cierre «Sé parte de la misión» enorme. El carril lateral se volvió una barra flotante en forma de píldora abajo, con las mismas acciones y además el menú; en las páginas internas pasó lo mismo. También se sumó un punto rosa que sigue al cursor. <br>**Código:** fuentes Unbounded y Space Mono servidas desde el sitio, en lugar de Big Shoulders Display; nuevo `portada.js`; se borra `scroll-state.js` porque la barra ya no se esconde. <br>**Verificación:** 70 combinaciones sin errores ni desbordes, entrada y menú probados; axe sin violaciones; contraste sobre fotos corregido en Sede Espinal y en el sello del inicio, los avisos que quedan son falsos positivos revisados a ojo. |
| HU20 | ✅ (sitio v2) | **Animaciones de la referencia.** Se estudió el código de la web de referencia (React con framer-motion) y se llevaron sus animaciones a la portada con `motion`, que ya estaba en el proyecto, con los mismos tiempos y curvas. <br>**Qué se mueve:** entrada del inicio tras «Entrar» (foto de 0.6 a 1, nombre escalonado); la foto del inicio se aleja al bajar; la frase de la secuencia se escribe con cursor y las palabras cambian con desenfoque sobre brillos que se desplazan; títulos que se pintan; intro de programas y Sede Espinal con desenfoque ligado al scroll; filas de impacto escalonadas; rebote de «Sigue»; apariciones de 40 px en 0.8 s. <br>**Código:** nuevo `movimiento.js`; `portada.js` avisa con `entrada:cerrada`. <br>**Verificación:** 70 combinaciones sin errores, axe sin violaciones, movimiento reducido y celular probados. |
| HU21 | ✅ (sitio v2) | **Paleta, letras y espacios ordenados.** Neutros tomados de la web de referencia (#050505 fondo, #131313 tarjetas, #f7f5f2 texto, #9b9b9b gris, #51595f acero; crema #f7f5f2 en Momentos), con el rosa y el amarillo del logo como acentos (elección del usuario). Los ~50 tamaños de letra sueltos pasan a 10 papeles con la escala de la referencia (`--t-nota` 0.75 rem a `--t-gigante` 7.75 rem, fluidos en los grandes) y las separaciones a una escala de 4 px (`--e-1` a `--e-8`). Sin cambios de contenido. <br>**Verificación:** 70 combinaciones sin errores, axe sin violaciones, títulos que caben a 320 y 390 px. |
| HU22 | ✅ (sitio v2) | **Tema claro: seguridad y calma.** El usuario no quería el negro. La página pasa a blanco cálido #fbfaf8 con tarjetas blancas, secciones alternas en azul muy suave #eef3f7 (Historia, Momentos, Informes) y texto azul noche #16202a. El rosa y el amarillo del logo siguen; en claro el rosa de texto y las cifras usan #c81d52. <br>**Zonas en azul noche** (#0f1923, no negro), solo donde el texto va sobre fotos (inicio, Sede Espinal, tarjetas de historias y equipo, portada de páginas internas en escritorio), para que nada se vea recargado; Impacto, el pie y la campaña de Navidad quedan claros (cifras en rosa, detalle navideño en rojo); redefinen las mismas variables, y los blancos transparentes salen de `color-mix` con `--texto`. En celular, el texto de la portada interna va debajo de la foto. <br>**También:** filas de Impacto en la escala; títulos en Unbounded limitados al ancho de su columna para que ninguna palabra se parta; nieve con borde azul para verse sobre claro. <br>**Verificación:** 70 combinaciones sin errores; ninguna palabra partida a 390–1440 px; axe solo marca texto sobre fotos (la foto va en `z-index: -1` y axe toma el blanco de la página), medido aparte con píxeles reales. |
| HU23 | ✅ (sitio v2) | **Fotos y videos sin cortar a las personas.** La auditoría encontró fotos horizontales en cajas verticales: hasta 59–70 % del ancho perdido en las tarjetas de talentos, 55 % en las galerías internas y 76 % en Sede Espinal en celular. <br>**Qué cambia:** en las cajas de forma fija la foto va entera con su copia desenfocada detrás (`encaje.js`, también en las páginas internas vía `interna.js`); galerías, Momentos, programas y Fundación toman la proporción de cada foto; inicio y Sede Espinal en celular muestran la foto en una franja con su proporción; los videos se ven completos (`contain`). Cada `srcset` lista todos los anchos disponibles (las tarjetas de talentos ya pueden usar la versión de 1600 px). <br>**Error corregido:** el degradado de las tarjetas (`.historia::after`) tapaba el botón de los videos de testimonios y no se podían reproducir con un clic (ya pasaba en producción). <br>**Límite:** los videos están en su resolución original (480–768 px de ancho) y las fotos llegan a 720–1600 px; para más calidad hacen falta los archivos originales. <br>**Verificación:** recorte por foto medido en 7 páginas × 2 tamaños: solo queda un 10 % en la foto a sangre de Sede Espinal en escritorio; videos reproducidos; 70 combinaciones sin errores. |
| HU24 | ✅ (sitio v2) | **Auditoría de diseño, organización y claridad** (crítica de la skill impeccable: 21/32 = 66 %, guardada en `.impeccable/critique/`). Se atendieron sus 5 problemas: <br>**Orden:** Inicio → Fundación + Historia → Programas → Impacto → Navidad → Testimonios → Talentos → Sede Espinal → Momentos → Equipo → Informes → Contacto (Programas pasa de la pantalla ~10 a la 7 en escritorio y a la 5 en celular); secuencia de palabras de 2 pantallas y oculta en celular; menú en ese orden. <br>**Acciones:** un solo nombre por acción (Donar, Ser voluntario, Inscribirme); «Inscribirme» en cada programa y «¿Cómo participar?» en tres pasos; todo «Donar» lleva a `#donar`; bloque «Cómo donar» listo y visible solo con datos reales en `site.json` (pendientes del usuario). <br>**Formulario:** teléfono y correo opcionales; avisa que abre WhatsApp. <br>**Menos ruido:** sin números de capítulo, botones en letra normal, el Formulario 5245 ya no parece un año. <br>**Verificación:** contenido intacto (reordenado y comparado línea a línea); formulario probado con y sin teléfono o correo; 70 combinaciones sin errores; axe sin marcas nuevas. |
| HU25 | ✅ (sitio v2) | **Más movimiento con GSAP.** El usuario pidió que la página no se sintiera estática, con los movimientos de la web de referencia, e instaló las skills oficiales de GSAP (greensock/gsap-skills). No se copió código de la referencia: cada efecto se recreó con código propio. <br>**Qué cambia:** se reemplaza `motion` por GSAP 3.15.0 (ScrollTrigger y SplitText, 48 KB comprimido); entrada del inicio en cada visita; títulos letra a letra; fotos que se descubren y paralaje en Programas; Sede Espinal fija en escritorio; tarjetas de Programas que se apilan; carruseles que se arrastran con inercia (hecho a mano: el modo scroll de Draggable rompía la cuadrícula) y cursor con píldora «Arrastra»/«Ver». En celular también hay movimiento (sin desenfoques ni pantallas fijas). «Donar» vuelve a abrir WhatsApp directamente (el usuario prefiere dar los datos por chat). <br>**Verificación:** sin errores de consola; arrastre probado en los 3 carruseles sin abrir videos por error y un clic sin mover sigue abriendo el video; con movimiento reducido no se crea ninguna animación; 70 combinaciones sin errores; axe sin marcas nuevas. |
| HU26 | ✅ (sitio v2) | **Ajustes de movimiento tras revisarlo con animaciones activas.** <br>**Arreglos:** en Programas (escritorio) la tarjeta que subía no tenía fondo y se veían dos textos encimados (al fijar una tarjeta, GSAP la envuelve y el selector `+` de CSS dejaba de aplicar), y el texto de la tarjeta fija quedaba invisible (el efecto leía su opacidad 0 antes de revelarse); la primera pantalla de la frase animada salía vacía (ahora empieza a escribirse mientras sube); las fotos de «Momentos» tenían alturas desiguales y la vertical dejaba un hueco grande (ahora mismo marco 4:3, enteras). <br>**Nuevo:** las tarjetas de testimonios, actividades, momentos, equipo e informes suben en grupo, una tras otra; si se llega con un enlace a una sección de más abajo, las de arriba aparecen sin esperar. <br>**Verificación:** recorrido con capturas en 1440 y 390 sin errores; 70 combinaciones sin fallos. |
| HU17 | ✅ (v60) | **Chat con Claude.** Lo que la persona escribe en el asistente lo responde Claude (`claude-opus-5-5`, esfuerzo `low`) desde la función de Vercel `api/chat.mjs`, con las reglas y los datos de la fundación de `api/_contexto.mjs`: responde solo con información del sitio, no inventa montos ni cuentas y deriva a WhatsApp lo que no sabe. Las preguntas rápidas siguen siendo instantáneas y gratis. Protecciones: dominio permitido, 8 mensajes por minuto e IP, 600 caracteres por mensaje, historial tratado como dato no fiable y enlaces solo a sitios de la fundación. Sin `ANTHROPIC_API_KEY` o con la API caída, el chat responde como antes. **Verificación:** comprobaciones de la función (validación, origen, método, límite) y del chat con la API simulada (respuesta con enlaces, HTML inyectado mostrado como texto, caída → respuesta fija); 70 combinaciones sin fallos. **Falta:** probarlo con una clave real en Vercel. |
| HU16 | ✅ (v59) | **Movimiento de la portada con `motion`.** Solo donde aporta y con la herramienta más barata: <br>• **Con `motion` (`scroll()`, en el compositor):** barra de lectura con `scaleX` en vez de `width` (ya no recalcula el diseño en cada scroll); la foto del hero baja más despacio que la página; la línea de «Mejores momentos» se dibuja a medida que se recorre el año. <br>• **Con CSS:** curva `--ease-out` (nuevo token, junto a `--ease-in-out`) en las apariciones; escalonado de 70 ms entre lo que entra junto (antes era por posición en la página: casi todo esperaba 300 ms); antetítulo, título y texto de cada encabezado entran uno tras otro; los botones se hunden al pulsar (120 ms) y ya no se quedan levantados en pantallas táctiles; los puntos de la línea de tiempo crecen al aparecer. <br>• Los contadores de Impacto también se animan en celular. <br>• **No se animó** lo que se usa muchas veces o lo que se lee: menú, chat, formulario, carruseles. <br>• **Movimiento reducido:** sin desplazamientos; la barra de lectura sigue porque informa. Celulares y equipos con poca memoria no cargan los efectos de profundidad. <br>**Verificación:** efectos medidos en Chromium a 1440 y 390 px y con movimiento reducido; 70 combinaciones sin errores ni desbordes; axe sin violaciones. |
| 3.2 cortes | ✅ (v58, HU15) | Los `max-width` distintos bajan de **23 a 13**: 480 y 520 → 560, 620 → 640, 680 y 700 → 720, 960 → 980, 1080 y 1120 → 1079 (20 `@media`). Solo se movió un corte cuando ningún ancho de dispositivo común (320–430 de celulares, 600–932 de tabletas y celulares en horizontal, 1024–1920 de escritorio; 25 anchos) queda entre el valor viejo y el nuevo, así que en esos anchos el diseño es idéntico; solo cambia en anchos intermedios sin dispositivo, como una ventana de 500 px. Los 13 restantes no se pueden juntar sin cambiar algún dispositivo (820/840 rodean 834, 760/768 rodean 768). **Verificación:** estilo calculado de las 7 páginas, con y sin Navidad, a 390, 600, 768, 820, 1024 y 1280 px (84 configuraciones): sin diferencias reales; solo ruido que aparece en los dos sentidos (la animación de entrada de los botones del hero capturada a medias y desfases de 0,02 px en el pie). |

**Verificación:** las 7 páginas en Chromium a 320, 390 y 1440 px, con y sin temporada: sin errores de JavaScript, sin imágenes rotas y sin contenido fuera de pantalla. Libro, chatbot y CTA probados. **axe no se volvió a ejecutar en v48** (sí en v51, HU6).

**Verificación v51 (HU6):** se cargaron el CSS de `dev` y el de `hu6` sobre las mismas páginas y se comparó el estilo calculado (colores, fondos, bordes, radios, sombras, fuente, tamaño y medidas, también de `::before` y `::after`) de los 5.627 elementos de las 7 páginas, a 390 y 1440 px, con y sin Navidad, y en 3 estados: al cargar, con la página desplazada y con el menú abierto. **No hay diferencias**, salvo la animación de pulso de `.hero-badge-dot` y variaciones de ±0,016 px en el ancho del texto, que son ruido de rasterización (también aparecen al comparar `dev` consigo mismo). Sin errores de JavaScript, sin imágenes rotas y sin desborde horizontal a 320, 390 y 1440 px.
