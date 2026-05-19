# Documentacion del proyecto

Esta guia explica el sitio de la Fundacion Amigos Como Arroz de la forma mas directa posible: primero que hace cada archivo, despues como esta armada la pagina y al final como modificarla sin romper partes importantes.

## Resumen rapido

El proyecto es una pagina web estatica. No necesita instalacion, base de datos ni servidor especial para funcionar.

- `index.html`: contiene todo el contenido visible de la pagina.
- `css/styles.css`: define colores, tamanos, animaciones, responsive y apariencia visual.
- `js/main.js`: agrega interacciones como menu movil, animaciones al hacer scroll, formulario hacia WhatsApp, carrusel y boton para volver arriba.
- `README.md`: explica como abrir y mantener el proyecto.

Para probarlo, abre `index.html` en el navegador. Si algun navegador bloquea recursos externos por abrirlo como archivo local, usa un servidor estatico sencillo desde la carpeta del proyecto.

## Como leer el proyecto

Piensa en la pagina como tres capas:

1. `index.html` es el esqueleto: textos, secciones, enlaces, imagenes, formularios y botones.
2. `css/styles.css` es la presentacion: colores, distribucion, sombras, tamanos, movimiento y version movil.
3. `js/main.js` es el comportamiento: acciones que pasan despues de hacer clic, scrollear, cargar la pagina o enviar el formulario.

Cuando quieras cambiar algo visual, normalmente empiezas por `index.html` para ubicar el elemento y luego buscas su clase en `css/styles.css`.

Cuando quieras cambiar una interaccion, buscas el `id` o la clase en `js/main.js`.

## Estructura de archivos

```text
fundacion/
  index.html
  css/
    styles.css
  js/
    main.js
  docs/
    DOCUMENTACION.md
  README.md
```

## Secciones del HTML

Todas las secciones principales estan dentro de `<main id="main">`.

| Seccion | ID | Para que sirve |
|---|---|---|
| Hero / Inicio | `inicio` | Primera pantalla con nombre de la fundacion y botones principales. |
| Fundacion | `fundacion` | Presenta la mision general y una imagen de apoyo. |
| Programas | `programas` | Muestra los programas Semilla, Siembra y Cosecha. |
| Impacto | `impacto` | Muestra metricas con contadores animados. |
| Testimonios | `testimonios` | Incluye opiniones o historias de beneficiarios y comunidad. |
| Momentos | `momentos` | Linea de tiempo con hitos del ano. |
| Equipo | `equipo` | Carrusel horizontal de integrantes. |
| Videos | `videos` | Videos incrustados desde YouTube. |
| Contacto | `contacto` | Datos de contacto y formulario que abre WhatsApp. |
| Footer | sin ID principal | Enlaces finales y redes sociales. |

### Navegacion

El menu superior usa enlaces tipo ancla:

```html
<a class="nav-link" href="#programas">Programas</a>
```

El valor de `href` debe coincidir con el `id` de una seccion:

```html
<section class="section" id="programas">
```

Si agregas una seccion nueva y quieres que aparezca en el menu, debes hacer dos cosas:

1. Crear la seccion con un `id` unico.
2. Agregar un enlace en la lista `<ul class="nav-list" id="nav-list">`.

## Guia para editar contenido

### Cambiar textos principales

Archivo: `index.html`

Busca el titulo o texto actual y editalo directamente. Ejemplo:

```html
<h1 class="hero-title" id="hero-title">Amigos Como Arroz</h1>
```

### Cambiar programas

Archivo: `index.html`

Cada programa es una tarjeta:

```html
<article class="program-card reveal">
  <div class="program-icon" aria-hidden="true">🌱</div>
  <h3>Semilla</h3>
  <p>...</p>
  <a href="#contacto">Mas informacion →</a>
</article>
```

Para agregar otro programa, copia una tarjeta completa y cambia icono, titulo, descripcion y enlace.

### Cambiar metricas de impacto

Archivo: `index.html`

Los numeros animados usan `data-counter`:

```html
<strong data-counter="4200">0</strong>
```

El numero final es el valor de `data-counter`. El `0` inicial se deja asi porque JavaScript lo anima hasta llegar al valor final.

### Cambiar integrantes del equipo

Archivo: `index.html`

Cada integrante esta dentro de:

```html
<article class="team-card-modern">
```

Edita la imagen, el nombre, el rol y los datos de `team-meta`. El carrusel se ajusta automaticamente porque `js/main.js` detecta todas las tarjetas con la clase `.team-card-modern`.

### Cambiar videos

Archivo: `index.html`

Los videos estan en iframes de YouTube:

```html
<iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>
```

Para usar otro video, copia el ID del video de YouTube y reemplaza `VIDEO_ID`.

### Cambiar WhatsApp

Archivos:

- `index.html`
- `js/main.js`

En `index.html` hay enlaces directos como:

```html
https://wa.me/573187073308
```

En `js/main.js` el formulario arma un mensaje y abre:

```js
const whatsappUrl = `https://wa.me/573187073308?text=${encodeURIComponent(whatsappMessage)}`;
```

Si cambia el numero, hay que actualizarlo en ambos archivos para que el boton flotante, el footer y el formulario apunten al mismo contacto.

## Guia del CSS

Archivo: `css/styles.css`

El CSS esta organizado por bloques, aunque al final hay varios refinamientos y overrides acumulados. En CSS gana la regla que aparece mas abajo si tiene la misma prioridad, por eso los bloques finales son importantes.

### Variables globales

Al inicio estan los colores y valores base:

```css
:root {
  --orange: #f37021;
  --pink: #ec255a;
  --dark: #151515;
  --container: 1180px;
}
```

Si quieres cambiar la identidad visual completa, empieza por estas variables.

### Clases base importantes

| Clase | Uso |
|---|---|
| `.container` | Limita el ancho del contenido y lo centra. |
| `.section` | Da espacio vertical entre secciones. |
| `.section-header` | Agrupa titulo, etiqueta y descripcion de una seccion. |
| `.btn` | Estilo base de botones. |
| `.reveal` | Elementos que aparecen con animacion al hacer scroll. |
| `.visible` | Clase que JavaScript agrega cuando un elemento ya debe mostrarse. |

### Responsive

Hay reglas para pantallas pequenas con `@media`, especialmente alrededor de:

- `max-width: 1080px`
- `max-width: 840px`
- `max-width: 620px`
- `max-width: 560px`
- `max-width: 520px`
- `max-width: 480px`

Si algo se ve bien en computador pero mal en celular, busca primero las reglas `@media` del final del CSS.

### Importante sobre el CSS actual

El archivo tiene muchos bloques de "refinamiento final" y varias clases repetidas, por ejemplo contacto, navegacion, logo y responsive. Esto funciona porque las ultimas reglas pisan a las anteriores, pero hace que mantenerlo sea mas dificil.

Recomendacion para futuras mejoras: compactar el CSS en secciones definitivas y eliminar estilos antiguos que ya no se usan.

## Guia del JavaScript

Archivo: `js/main.js`

El JavaScript se ejecuta en el navegador cuando carga la pagina. No usa librerias externas.

### 1. Seleccion de elementos

Al inicio se guardan referencias a elementos importantes:

```js
const siteHeader = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navList = document.querySelector("#nav-list");
```

Esto permite modificar clases, escuchar clics y actualizar estados.

### 2. Menu movil

Funciones principales:

- `setMenuState(isOpen)`: abre o cierra el menu.
- `closeMenu()`: cierra el menu si esta abierto.
- `toggleMenu()`: alterna entre abierto y cerrado.

Tambien actualiza atributos de accesibilidad como `aria-expanded` y `aria-label`.

### 3. Enlace activo segun la seccion visible

Usa `IntersectionObserver` para detectar que seccion esta visible y marcar el enlace del menu correspondiente con `.active`.

Esto depende de que:

- Las secciones tengan `id`.
- Los enlaces del menu apunten a esos ids con `href="#id"`.

### 4. Animaciones al hacer scroll

Los elementos con clase `.reveal` son observados. Cuando entran en pantalla, JavaScript les agrega `.visible`.

```js
entry.target.classList.add("visible");
```

El CSS se encarga de la animacion visual.

### 5. Contadores animados

La funcion `animateCounter(counter)` lee `data-counter` y anima el numero.

Ejemplo en HTML:

```html
<strong data-counter="180">0</strong>
```

Si el usuario tiene activada la opcion de reducir movimiento en su sistema, el contador no anima y muestra el valor final directamente.

### 6. Barra de progreso y header inteligente

`updateReadingProgress()` hace tres cosas:

- Calcula cuanto ha bajado el usuario en la pagina.
- Actualiza la barra superior de progreso.
- Oculta el header al bajar y lo muestra al subir.

Tambien oculta el dock de redes cuando el usuario llega cerca de la seccion de contacto.

### 7. Parallax del hero

En computadores con mouse y si el usuario no ha reducido animaciones, el hero reacciona suavemente al movimiento del mouse.

Las posiciones se guardan en variables CSS:

```js
hero.style.setProperty("--hero-x", "...");
hero.style.setProperty("--hero-y", "...");
```

### 8. Formulario de contacto

El formulario no envia datos a un servidor. Valida campos basicos y abre WhatsApp con un mensaje armado automaticamente.

Campos requeridos:

- Nombre
- Telefono
- Correo
- Interes
- Mensaje

Si el correo no tiene formato valido, muestra un mensaje de error en `#form-status`.

### 9. Carrusel del equipo

El carrusel detecta las tarjetas `.team-card-modern`, crea puntos indicadores y avanza automaticamente cada 4.2 segundos.

Se pausa cuando:

- El carrusel sale de la pantalla.
- El usuario pone el cursor encima.

Los botones `#teamPrev` y `#teamNext` mueven el carrusel manualmente.

### 10. Boton volver arriba

El boton `#scrollTopBtn` aparece cuando el usuario baja mas de 200px y vuelve al inicio con scroll suave.

## Revision del codigo

### Lo que esta bien

- La pagina usa HTML semantico con `section`, `article`, `header`, `main`, `footer` y etiquetas descriptivas.
- Hay buenas bases de accesibilidad: `skip-link`, `aria-label`, `aria-live`, `aria-expanded`, `aria-controls` y textos alternativos en imagenes.
- El JavaScript esta separado del HTML y organizado por bloques funcionales.
- Se respeta `prefers-reduced-motion`, lo cual mejora accesibilidad.
- El formulario evita envios vacios y codifica el mensaje antes de abrir WhatsApp.
- El sitio es facil de desplegar porque no depende de compilacion.

### Riesgos o puntos a mejorar

1. CSS demasiado acumulado.
   Hay muchas reglas repetidas y overrides finales. Funciona, pero cada cambio visual puede tener efectos inesperados porque una regla posterior puede pisar una anterior.

2. Imagen del logo embebida en base64.
   El logo dentro de `index.html` hace crecer mucho el archivo. Es mejor moverlo a `assets/logo.jpg` o `assets/logo.png` y referenciarlo con `src="assets/logo.png"`.

3. Dependencia de recursos externos.
   La pagina usa Google Fonts, Unsplash y YouTube. Si no hay internet, esas imagenes, fuentes o videos pueden fallar.

4. Datos de ejemplo en equipo.
   Los integrantes dicen "Nombre Integrante 1", etc. Conviene reemplazarlos por nombres reales antes de publicar.

5. Formulario sin backend.
   El contacto abre WhatsApp, pero no guarda mensajes en una base de datos ni envia correo. Si se necesita historial, hay que conectar un backend, Formspree, Netlify Forms o servicio similar.

6. JavaScript asume que algunos elementos existen.
   Como la pagina actual si los tiene, funciona. Pero si en el futuro se elimina `#hero-content`, `#contact-form`, `#reading-progress-bar` o `.menu-toggle`, el script puede fallar. Para hacerlo mas robusto, se pueden agregar validaciones antes de usar esos elementos.

7. Videos de YouTube sin `sandbox`.
   Los iframes tienen permisos acotados por `allow`, pero no usan `sandbox`. No es obligatorio para este caso, aunque seria una mejora de seguridad si se quiere endurecer la pagina.

## Como hacer cambios comunes

### Cambiar colores principales

Edita `:root` en `css/styles.css`.

```css
--orange: #f37021;
--pink: #ec255a;
--yellow: #ffd22e;
```

### Cambiar el telefono de contacto

Busca el numero en todo el proyecto:

```powershell
Select-String -Path index.html,js\main.js -Pattern "573187073308"
```

Luego reemplazalo en cada aparicion.

### Agregar una seccion nueva

1. Crea un bloque `<section class="section" id="nuevo-id">` en `index.html`.
2. Agrega un enlace en el menu: `<a class="nav-link" href="#nuevo-id">Nombre</a>`.
3. Agrega estilos en `css/styles.css` si necesita diseno especial.
4. Si quieres animacion, agrega la clase `reveal` a los elementos internos.

### Agregar una tarjeta con animacion

Agrega `reveal`:

```html
<article class="program-card reveal">
```

JavaScript la detectara automaticamente y el CSS aplicara la animacion.

### Cambiar imagenes

Reemplaza el atributo `src` de la imagen:

```html
<img src="URL_O_RUTA" alt="Descripcion clara" loading="lazy" />
```

Mantener `alt` es importante para accesibilidad.

## Recomendaciones de mantenimiento

- Crear carpeta `assets/` para logo, imagenes propias y recursos locales.
- Limpiar `css/styles.css` y dejar una sola definicion final por componente.
- Separar el CSS en bloques mas pequenos si el proyecto crece: `base.css`, `layout.css`, `components.css`, `responsive.css`.
- Reemplazar nombres e imagenes genericas del equipo por informacion real.
- Probar siempre en computador y celular despues de tocar header, hero, contacto o responsive.
- Si se va a publicar formalmente, revisar SEO basico: imagen social, favicon, titulo, descripcion y datos reales.

## Checklist antes de publicar

- [ ] El telefono de WhatsApp es correcto.
- [ ] El correo es correcto.
- [ ] Instagram y Facebook apuntan a perfiles reales.
- [ ] Los nombres del equipo son reales.
- [ ] Las imagenes tienen permiso de uso o son propias.
- [ ] Los videos son los oficiales.
- [ ] El sitio se ve bien en celular.
- [ ] El formulario abre WhatsApp con el mensaje correcto.
- [ ] Los textos no tienen errores de ortografia.
- [ ] El logo carga correctamente.

