# Auditoría frontend y temporada navideña · noviembre 2026

> **Documento histórico.** Describe el sitio antes de HU26 y ya no corresponde al estado actual. Lo vigente está en [AUDITORIA-HU26.md](AUDITORIA-HU26.md) y [README.md](README.md).

Revisión de la landing de la Fundación Amigos Como Arroz (`index.html`, `assets/css/styles.css`, `assets/js/*.js` y páginas internas).

**Suposiciones**

- Stack: sitio estático en HTML, CSS y JavaScript sin framework ni build (según el `README.md`), publicado en hosting estático tipo GitHub Pages (por `.nojekyll`).
- Negocio: fundación sin ánimo de lucro (NGO) en Neiva, Huila, con sede en Espinal, Tolima. El objetivo de conversión es donar, hacerse voluntario o contactar por WhatsApp.
- La fundación nació en septiembre de 2007 (texto de la sección Historia), así que en 2026 son **19 años**. Se corrigió el "12+ años" del hero; confirmar con la fundación.
- El nombre "Caren González" se dejó tal como aparece en el título de la tarjeta; el `alt` decía "Karen". Confirmar la ortografía correcta.
- El texto de la campaña navideña es genérico (no promete cifras ni eventos concretos). Ajustarlo a la campaña real.

---

## 1. Diagnóstico de código

### Lo que está bien

- **JavaScript ordenado**: `main.js` centraliza selectores en `SELECTORS`, separa cada funcionalidad en `init*()`, usa `IntersectionObserver`, `requestAnimationFrame`, listeners pasivos y respeta `prefers-reduced-motion`. Es la parte más sana del proyecto.
- **HTML semántico**: `header`, `nav`, `main`, `section` con `aria-labelledby`, skip link, `label` en todos los campos, `width`/`height` en imágenes y `loading="lazy"`.
- **SEO técnico**: canonical, Open Graph, Twitter Card, JSON-LD `NGO`, `sitemap.xml`, `robots.txt` y manifest.
- **Videos diferidos**: el `<video>` solo se crea al pulsar el póster, así no se descargan 65 MB de video al abrir la página.

### Problemas

| # | Problema | Evidencia | Impacto |
|---|----------|-----------|---------|
| C1 | **CSS por acumulación** ("append-only") | `styles.css` tiene 11.618 líneas y 235 KB; `:root` está declarado 5 veces con valores distintos; `.nav-list {` aparece 30 veces, `.site-header {` 11 y `.hero-title` 18; hay **524 `!important`** | Cada cambio nuevo obliga a otra capa de sobrescritura. Es la principal deuda: **la base no es escalable en su estado actual** |
| C2 | Tipografía declarada 3 veces con fuentes distintas | Se cargan Inter y Cormorant de Google Fonts, pero el cuerpo usaba `Aptos, "Segoe UI", Inter`: en Windows se veía Segoe y en Android/Mac Inter. `Playfair Display` aparece en reglas pero nunca se carga | Marca inconsistente entre dispositivos y bytes descargados que no se usan |
| C3 | El bloque de contacto estaba oculto | `.contact-info { display: none; }` (línea ~3518), aunque después se añadieron estilos para sus botones "Donar" y "Ser voluntario" | El botón de donación, la dirección, el teléfono y el correo no se veían, y el `h2` de la sección estaba oculto |
| C4 | `content-visibility` sin `auto` | `contain-intrinsic-size: 1px 900px` | La barra de desplazamiento salta al pintar secciones |
| C5 | Versionado de caché inconsistente | `styles.css?v=46` en la portada, `?v=33` en `programas/` | Las páginas internas pueden mostrar estilos viejos |
| C6 | Imágenes duplicadas y sin optimizar | `duenos-hero-clean.jpg` está en dos carpetas; `assets/cosecha` y `assets/siembra/becados` tienen los mismos 4 archivos; fotos de hasta 636 KB en JPEG con nombres `WhatsApp Image ... AM.jpeg` | Peso del repositorio, nombres con espacios en URLs y LCP más lento en móvil |
| C7 | WhatsApp hardcodeado | El número aparece 8 veces en el HTML y en `main.js` | Cambiar el número implica buscar y reemplazar en varios archivos |

### ¿Es escalable?

**El JavaScript y el HTML sí; el CSS no.** Para que la base sea mantenible:

1. **Dividir `styles.css` por responsabilidad** (sin cambiar el diseño):
   ```
   assets/css/
     tokens.css        colores, tipografía, radios, sombras (UN solo :root)
     base.css          reset, body, enlaces, foco, utilidades (.sr-only, .container)
     layout.css        header, nav, footer, section, grids
     components/       btn.css, card.css, carousel.css, chatbot.css, form.css...
     sections/         hero.css, historia.css, contacto.css, informes.css...
     pages/            programas.css, sede-espinal.css
     seasonal/         navidad.css  (ya creado)
   ```
   Con un `main.css` que los importe en orden mediante `@layer tokens, base, layout, components, sections, pages, seasonal;`. Las capas de cascada eliminan la necesidad de `!important`: gana el orden de la capa, no la especificidad.
2. **Consolidar duplicados**: por cada selector repetido, quedarse con el valor que hoy se ve en pantalla (el último que gana) y borrar el resto. Hacerlo sección por sección, comparando capturas antes y después.
3. **Un solo `:root`** con los tokens finales; los colores sueltos (`#c96f4a`, `rgba(201,111,74,…)`) pasan a variables.
4. **Datos de contacto en un solo lugar**: `const CONTACT = { whatsapp: "573187073308", … }` en `main.js` y atributos `data-wa-text` en los enlaces.

---

## 2. Diagnóstico de diseño

| Área | Evaluación |
|------|------------|
| Jerarquía visual | Buena dentro de cada sección (eyebrow, h2, lead). **Problema:** en escritorio el primer pantallazo es solo la foto; el nombre, el mensaje y los botones quedan debajo del pliegue. El menú lista 13 enlaces y no seguía el orden real de la página. |
| Tipografía | Cormorant Garamond para títulos y una sans para texto es una buena pareja cálida e institucional. Se unificó el cuerpo en Inter. |
| Paleta | Terracota, rosa y dorado cálido, coherente con el logo. Los botones con texto blanco no llegaban al contraste AA. |
| Espaciado | Consistente gracias a `clamp()`. Las secciones son muy altas en móvil (unos 19.500 px de página). |
| Responsive | Funciona en 390 px sin desbordes horizontales. Los carruseles usan scroll-snap. Hay cuatro elementos flotantes a la vez en móvil (chatbot, WhatsApp, Instagram, Facebook), lo que tapa contenido. |
| Accesibilidad | **Menú cerrado:** sus 13 enlaces eran invisibles (`opacity: 0`) pero seguían en el orden del tabulador. **Contraste** insuficiente en 6 botones. **`alt` incorrectos:** una foto del equipo decía "Logo de la Fundación". El foco visible era de bajo contraste. |

---

## 3. Temporada navideña

### Cómo encender y apagar

En `assets/js/seasonal.js`:

```js
const SEASON_CONFIG = {
  name: "navidad",
  mode: "auto",                          // "auto" | "on" | "off"
  window: { from: "11-15", to: "01-06" } // en "auto": 15 nov -> 6 ene
};
```

- `"auto"` (por defecto): se activa sola entre el 15 de noviembre y el 6 de enero, y se apaga sola después.
- Vista previa sin tocar código: `index.html?temporada=navidad` o `?temporada=off`.
- Con la temporada apagada, el sitio es idéntico al original: todos los estilos dependen de `html[data-season="navidad"]` y los bloques HTML llevan `hidden`.

### Qué añade

| Elemento | Dónde | Notas |
|----------|-------|-------|
| Paleta de temporada | `navidad.css` §1 | Rojo `#9e1b32`, verde pino `#1f4d36` y dorado `#d4a64a`. Reasigna `--pink` y `--yellow`, así los acentos existentes cambian solos. |
| Guirnalda de luces | Bajo el header | Generada por JS y decorativa (`aria-hidden`). |
| Nieve y destellos dorados | Toda la página | 22 copos en escritorio y 10 en móvil. Solo usan `transform`, no se crean con "reducir movimiento" y no se imprimen. |
| Botón "Nieve" | Izquierda del header | Pausa y reanuda la nieve, y recuerda la elección (WCAG 2.2.2). |
| Acceso a la campaña | Hero | Píldora "Campaña de Navidad" que lleva a `#navidad`. |
| Sección de campaña | Entre el hero y Actividades | Botones "Donar" y "Ser voluntario" con mensajes de WhatsApp navideños y eventos de analítica `categoria=navidad`. |
| Cuenta regresiva | Dentro de la campaña | Novena de Aguinaldos (16-24 dic), Navidad y Año Nuevo. |
| Acentos discretos | Métrica destacada, fecha "Diciembre" de la línea de tiempo, borde del footer y nota "Felices fiestas" | |

### Retirar la temporada por completo

1. Borrar `assets/css/seasonal/navidad.css` y `assets/js/seasonal.js`.
2. Quitar sus dos líneas del `<head>` en cada página.
3. Borrar los bloques con `data-season-only="navidad"` en `index.html`.

Para una temporada futura (aniversario, vacaciones), copiar `navidad.css` como `aniversario.css`, cambiar `name` y `window` en `SEASON_CONFIG` y usar `data-season-only="aniversario"`.

---

## 4. Cambios aplicados

| Archivo | Cambio |
|---------|--------|
| `assets/js/seasonal.js` | **Nuevo.** Motor de temporadas: activación, guirnalda, nieve, botón de pausa y cuenta regresiva. |
| `assets/css/seasonal/navidad.css` | **Nuevo.** Todos los estilos navideños, aislados. |
| `index.html` | Enlaces de temporada en el `<head>`, píldora en el hero, sección `#navidad` y nota en el footer. Menú reordenado según la página. "12+ años" → "19 años". Corrección de `alt` en el equipo. `type="button"` en "volver arriba". Caché `styles v47` y `main v5`. |
| `assets/css/styles.css` | Bloque final "CAPA DE CORRECCIONES v47": tipografía unificada; menú cerrado fuera del foco; contraste AA en botones naranja, rosa, WhatsApp y Facebook; contacto visible en dos columnas; `contain-intrinsic-size: auto`; foco visible más fuerte. |
| `programas/*.html`, `sede-espinal/index.html` | Temporada enlazada y caché `v=47`. |

Verificado con axe-core (WCAG 2 A/AA) con y sin temporada: **0 violaciones** (antes: 6 de contraste). Probado en 1440 px y 390 px, con "reducir movimiento" y con navegación por teclado.

---

## 5. Pendientes priorizados

| Prioridad | Mejora | Impacto | Esfuerzo |
|-----------|--------|---------|----------|
| 1 | Optimizar imágenes: WebP/AVIF a 1600 px máx. con `srcset`, y renombrar sin espacios | Alto (LCP móvil, datos) | Bajo |
| 2 | Hero en escritorio: mostrar el título y el CTA en el primer pantallazo (foto más baja o texto superpuesto con degradado) | Alto (conversión) | Bajo-medio |
| 3 | Agrupar los botones flotantes en móvil (un solo botón "Contacto" que despliegue WhatsApp, redes y chat) | Medio | Medio |
| 4 | Dividir `styles.css` en módulos con `@layer` y consolidar duplicados | Alto (mantenimiento) | Alto, hacerlo por secciones |
| 5 | Quitar archivos duplicados (`assets/cosecha` ≈ `assets/siembra/becados`, `pantalla inicio/`) | Bajo | Bajo |
| 6 | Centralizar el número de WhatsApp en JS | Medio | Bajo |
| 7 | Comprimir los PDF de informes (el de 2025 pesa 19,5 MB) | Medio | Bajo |
