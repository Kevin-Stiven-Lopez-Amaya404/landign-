# Guia para programadores

Esta guia explica la organizacion actual del proyecto para que cualquier desarrollador pueda entrar, ubicar archivos, hacer cambios y evitar romper rutas.

## 1. Tipo de proyecto

El sitio es una landing institucional estatica. No usa framework, build system, base de datos ni backend.

El navegador carga directamente:

- HTML desde `index.html` y `programas/*.html`.
- CSS desde `assets/css/styles.css`.
- JavaScript desde `assets/js/main.js`.
- Imagenes desde `assets/img/`.

## 2. Estructura de carpetas

```text
landign-/
  index.html
  assets/
    README.md
    css/
      styles.css
    js/
      main.js
    img/
      README.md
      brand/
        logo-fundacion.jpg
      hero/
        hero-principal.jpg
      content/
        programa-semilla-deporte.jpg
        taller-educativo.jpg
        presentacion-cultural.jpg
      team/
        directora.jpg
        andres.jpg
        karen.jpg
  programas/
    README.md
    index.html
    semilla.html
    siembra.html
    cosecha.html
    psicosocial.html
  docs/
    README.md
    GUIA_PROGRAMADOR.md
    DOCUMENTACION.md
    PROGRAMAS.md
    CODIGO.md
  README.md
```

## 3. Responsabilidad de cada carpeta

| Ruta | Responsabilidad |
|---|---|
| `index.html` | Pagina principal, navegacion, hero, secciones institucionales, tarjetas de programas, equipo, videos y contacto. |
| `assets/css/styles.css` | Toda la apariencia visual, responsive, animaciones, header, programas, formularios y carrusel. |
| `assets/js/main.js` | Menu hamburguesa, scroll, animaciones, formulario, carrusel, videos lazy y datos dinamicos. |
| `assets/img/brand/` | Logo e identidad visual. |
| `assets/img/hero/` | Imagen principal de la pagina. |
| `assets/img/content/` | Imagenes de secciones, programas y momentos. |
| `assets/img/team/` | Fotos de integrantes del equipo. |
| `programas/index.html` | Vista general historica de los programas en una sola pagina. |
| `programas/semilla.html` | Pagina individual del programa Semilla. |
| `programas/siembra.html` | Pagina individual del programa Siembra. |
| `programas/cosecha.html` | Pagina individual del programa Cosecha. |
| `programas/psicosocial.html` | Pagina individual de Acompanamiento Psicosocial. |
| `docs/` | Documentacion tecnica y funcional del proyecto. |

## 4. Flujo de navegacion

La pagina principal muestra cuatro tarjetas en `#programas`:

```text
Semilla                  -> programas/semilla.html
Siembra                  -> programas/siembra.html
Cosecha                  -> programas/cosecha.html
Acompanamiento Psicosocial -> programas/psicosocial.html
```

Cada pagina individual vuelve al inicio con:

```html
../index.html#programas
```

Como los archivos dentro de `programas/` estan un nivel por debajo, sus recursos usan `../assets/...`.

Ejemplo:

```html
<link href="../assets/css/styles.css" rel="stylesheet" />
<img src="../assets/img/brand/logo-fundacion.jpg" alt="Logo Fundación Amigos Como Arroz" />
```

## 5. Rutas importantes

Desde `index.html`:

```html
assets/css/styles.css
assets/js/main.js
assets/img/brand/logo-fundacion.jpg
programas/semilla.html
```

Desde cualquier archivo dentro de `programas/`:

```html
../assets/css/styles.css
../assets/img/brand/logo-fundacion.jpg
../index.html#programas
```

## 6. Como hacer cambios comunes

### Cambiar contenido de la pagina principal

Edita `index.html`.

Ejemplos:

- Texto del hero.
- Tarjetas de programas.
- Metricas de impacto.
- Testimonios.
- Equipo.
- Videos.
- Formulario.

### Cambiar un programa

Edita el archivo correspondiente dentro de `programas/`:

- Semilla: `programas/semilla.html`
- Siembra: `programas/siembra.html`
- Cosecha: `programas/cosecha.html`
- Psicosocial: `programas/psicosocial.html`

Si tambien quieres cambiar la tarjeta que aparece en el inicio, edita `index.html` en la seccion `#programas`.

### Cambiar estilos

Edita `assets/css/styles.css`.

Clases frecuentes:

- `.site-header`: barra de navegacion.
- `.nav-list`: menu hamburguesa.
- `.hero`: imagen principal.
- `.hero-intro`: bloque de bienvenida bajo la imagen.
- `.program-grid`: tarjetas de programas en el inicio.
- `.program-card`: tarjeta individual de programa.
- `.program-detail-card`: tarjeta de informacion dentro de paginas de programa.
- `.program-timeline`: linea de tiempo de programas.
- `.contact-form`: formulario.
- `.team-slider`: carrusel del equipo.

### Cambiar comportamiento

Edita `assets/js/main.js`.

Funciones principales:

- `initMenu()`: menu hamburguesa.
- `initActiveSection()`: enlace activo de navegacion.
- `initHero()`: movimiento suave del hero.
- `initReveal()`: aparicion de elementos y contadores.
- `initScrollState()`: barra de progreso, header y boton subir.
- `initContactForm()`: validacion y envio a WhatsApp.
- `initTeamSlider()`: carrusel del equipo.
- `initLazyVideos()`: carga de videos al hacer clic.

## 7. Como agregar un nuevo programa

1. Crea un archivo nuevo dentro de `programas/`, por ejemplo:

```text
programas/nuevo.html
```

2. Usa como base una pagina existente, por ejemplo `programas/semilla.html`.

3. En `index.html`, agrega una tarjeta dentro de:

```html
<div class="program-grid">
```

4. El enlace de la tarjeta debe apuntar al nuevo archivo:

```html
<a href="programas/nuevo.html">Más información &rarr;</a>
```

5. Si necesita estilos nuevos, agregalos al final de `assets/css/styles.css` o reutiliza clases existentes.

6. Actualiza `docs/PROGRAMAS.md`.

## 8. Imagenes y rendimiento

Las imagenes deben vivir dentro de la subcarpeta correcta:

- `assets/img/brand/`: logo e identidad.
- `assets/img/hero/`: imagen principal.
- `assets/img/content/`: imagenes de secciones o momentos.
- `assets/img/team/`: fotos de integrantes.

Buenas practicas:

- Usar imagenes optimizadas.
- Usar `loading="lazy"` en imagenes que no aparecen al inicio.
- Usar `decoding="async"` cuando aplique.
- Mantener `alt` descriptivo.
- No volver a incrustar imagenes en base64 dentro del HTML.

La imagen principal del hero se precarga desde `index.html`:

```html
<link rel="preload" as="image" href="assets/img/hero/hero-principal.jpg" fetchpriority="high" />
```

## 9. Formulario

El formulario esta en `index.html`:

```html
<form class="contact-form" id="contact-form" novalidate>
```

La validacion esta en `assets/js/main.js`, dentro de `initContactForm()`.

Actualmente el formulario:

- Valida nombre completo.
- Valida telefono.
- Valida correo.
- Valida interes.
- Valida mensaje.
- Abre WhatsApp con el mensaje armado.

No envia correo real ni guarda datos en base de datos. Para eso se necesita backend o servicio externo.

## 10. Reglas de mantenimiento

- No mezclar JavaScript dentro del HTML.
- No duplicar estilos si existe una clase reutilizable.
- Mantener las rutas relativas segun la ubicacion del archivo.
- Al mover archivos, revisar `href`, `src` y rutas `url(...)` del CSS.
- Mantener `docs/` actualizado cuando cambie la arquitectura.
- Probar en escritorio y movil despues de tocar header, hero, programas, contacto o carrusel.

## 11. Verificaciones recomendadas

Sintaxis de JavaScript:

```powershell
node --check assets\js\main.js
```

Buscar rutas antiguas despues de mover archivos:

```powershell
Select-String -Path index.html,programas\*.html,docs\*.md,README.md -Pattern "css/styles|js/main|img/|programa-"
```

Buscar numero de WhatsApp:

```powershell
Select-String -Path index.html,assets\js\main.js -Pattern "573187073308"
```

## 12. Riesgos conocidos

- `assets/css/styles.css` tiene muchos ajustes acumulados; funciona, pero conviene compactarlo en el futuro.
- El formulario depende de WhatsApp, no de un backend.
- Algunos videos dependen de YouTube.
- Antes de publicar, revisar datos reales: telefono, correo, redes, nombres, fotos y permisos de imagenes.
