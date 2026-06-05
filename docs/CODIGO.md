# Documentacion tecnica del codigo

Esta guia explica como esta organizado el codigo del sitio y que papel cumple cada archivo. Sirve para hacer cambios sin desordenar la estructura ni repetir codigo innecesario.

## 1. Estructura general

El proyecto esta construido como un sitio estatico:

```text
landign-/
  index.html
  assets/
    css/
      styles.css
    js/
      main.js
    img/
      brand/
      hero/
      content/
      team/
  programas/
    index.html
    semilla.html
    siembra.html
    cosecha.html
    psicosocial.html
  docs/
    DOCUMENTACION.md
    PROGRAMAS.md
    CODIGO.md
```

No usa framework, base de datos ni compilador. El navegador lee directamente HTML, CSS y JavaScript.

## 2. `index.html`

Es la pagina principal del sitio. Contiene el contenido visible y la estructura semantica.

Orden principal:

1. `<head>`: metadatos, titulo, CSS y precarga de la imagen principal.
2. `<body>`: contenido visible.
3. `.reading-progress`: barra superior que JavaScript actualiza con el scroll.
4. `.site-header`: barra de navegacion con logo y menu hamburguesa.
5. `#main`: todas las secciones principales.
6. `.site-footer`: enlaces finales, redes y datos de cierre.
7. `assets/js/main.js`: archivo que activa las interacciones.

Secciones dentro de `#main`:

- `#inicio`: imagen principal.
- `.hero-intro`: bloque de bienvenida debajo de la foto.
- `#fundacion`: informacion institucional.
- `#programas`: tarjetas Semilla, Siembra, Cosecha y Acompanamiento Psicosocial.
- `#impacto`: metricas con contadores.
- `#testimonios`: historias y comentarios.
- `#momentos`: linea de tiempo de actividades.
- `#equipo`: carrusel de integrantes.
- `#videos`: videos cargados bajo demanda.
- `#contacto`: formulario y datos de contacto.

## 3. `programas/`

Contiene las paginas secundarias para ampliar la informacion de los programas.

Estructura:

1. `index.html`: vista general de todas las rutas.
2. `semilla.html`: detalle y linea de tiempo de Semilla.
3. `siembra.html`: detalle y linea de tiempo de Siembra.
4. `cosecha.html`: detalle y linea de tiempo de Cosecha.
5. `psicosocial.html`: detalle del acompanamiento psicosocial.

Los botones del `index.html` apuntan directamente a cada pagina:

```html
programas/semilla.html
programas/siembra.html
programas/cosecha.html
programas/psicosocial.html
```

Esto permite que el usuario abra la pagina y llegue al programa exacto.

## 4. `assets/css/styles.css`

Controla toda la presentacion visual:

- Paleta de colores.
- Tipografia.
- Espaciados.
- Header y menu hamburguesa.
- Hero e imagen principal.
- Tarjetas.
- Formularios.
- Carrusel del equipo.
- Responsive para celulares y tablets.
- Animaciones y transiciones.

El archivo tiene reglas base al inicio y ajustes finales al final. En CSS, cuando dos reglas tienen la misma prioridad, gana la que esta mas abajo. Por eso los ultimos bloques son importantes.

Bloques clave:

- `:root`: variables globales.
- `.container`: ancho maximo y centrado.
- `.site-header`: barra de navegacion.
- `.hero`: imagen panoramica principal.
- `.hero-intro`: informacion debajo de la imagen.
- `.program-card`: tarjetas del bloque Programas.
- `.program-detail-*`: estilos de las paginas dentro de `programas/`.
- `.team-*`: carrusel y fotos del equipo.
- `.contact-*`: formulario y bloque de contacto.
- `@media`: adaptaciones responsive.

## 5. `assets/js/main.js`

Contiene toda la logica interactiva. Esta organizado por funciones `init*`, donde cada una activa una parte especifica del sitio.

### `SELECTORS`

Centraliza las clases e ids que usa JavaScript:

```js
const SELECTORS = {
  siteHeader: "#site-header",
  menuToggle: ".menu-toggle",
  navList: "#nav-list"
};
```

Esto evita buscar selectores repetidos por todo el archivo.

### `initMenu()`

Controla el menu hamburguesa:

- Abre y cierra el panel.
- Activa el fondo oscuro.
- Cierra con la tecla Escape.
- Cierra al hacer clic en un enlace.
- Actualiza `aria-expanded` y `aria-label`.

### `initActiveSection()`

Detecta que seccion esta visible y marca el enlace correcto del menu con `.active`.

Depende de que cada seccion tenga un `id` y cada enlace use `href="#id"`.

### `initHero()`

Activa un movimiento visual muy suave en la imagen principal cuando el usuario usa mouse.

Respeta `prefers-reduced-motion`, asi que no anima si el usuario prefiere menos movimiento.

### `initReveal()`

Muestra elementos con clase `.reveal` cuando entran en pantalla.

Tambien anima los numeros que tienen:

```html
data-counter="180"
```

### `initScrollState(menuApi)`

Agrupa lo que cambia con el scroll:

- Barra de progreso.
- Header que se oculta al bajar y aparece al subir.
- Boton para volver arriba.
- Contacto rapido.

### `initContactForm()`

Valida el formulario de contacto antes de enviar.

Campos validados:

- Nombre completo.
- Telefono.
- Correo electronico.
- Interes.
- Mensaje.

Si todo esta correcto, arma un mensaje y abre WhatsApp con la informacion del usuario.

### `initTeamSlider()`

Controla el carrusel del equipo:

- Boton anterior.
- Boton siguiente.
- Puntos indicadores.
- Avance automatico.
- Pausa cuando el carrusel no esta visible.
- Pausa cuando el usuario pone el cursor encima.

### `initLazyVideos()`

Funcion auxiliar para videos oficiales futuros.

La seccion actual enlaza a redes oficiales con tarjetas visuales. Si mas adelante se agregan botones `.video-lazy` con un `data-video-id` real, esta funcion cargara el iframe de YouTube solo cuando el usuario haga clic.

### `initMeta()`

Actualiza datos pequenos, como el ano actual del footer.

## 6. Flujo de carga

Al final de `main.js` se inicializa todo:

```js
const menuApi = initMenu();
initMeta();
initHero();
initActiveSection();
initReveal();
initScrollState(menuApi);
initContactForm();
initTeamSlider();
initLazyVideos();
```

El orden es importante:

- Primero se crea el menu, porque otras funciones necesitan saber si esta abierto.
- Despues se activan datos, animaciones, scroll, formulario, carrusel y videos.

## 7. Imagenes

Las imagenes optimizadas viven en `assets/img/`.

Ejemplos:

- `brand/logo-fundacion.jpg`
- `hero/hero-principal.jpg`
- `content/programa-semilla-deporte.jpg`
- `content/taller-educativo.jpg`
- `content/presentacion-cultural.jpg`
- `team/directora.jpg`
- `team/andres.jpg`
- `team/karen.jpg`

Buenas practicas usadas:

- `loading="lazy"` en imagenes que no son principales.
- `decoding="async"` para ayudar al navegador.
- Imagen principal precargada con `preload`.
- Fotos del equipo con tamano visual uniforme.

## 8. Formulario

El formulario esta en `index.html` y se identifica por:

```html
<form class="contact-form" id="contact-form" novalidate>
```

Se usa `novalidate` porque la validacion personalizada esta en `assets/js/main.js`.

Cada campo tiene su mensaje de error conectado con:

```html
aria-describedby="name-error"
```

JavaScript actualiza:

- `aria-invalid`
- texto del error
- mensaje general de estado

## 9. Reglas para mantener el codigo limpio

Cuando hagas cambios:

1. Cambia contenido principal en `index.html` o contenido de programas en `programas/`.
2. Cambia estilos en `assets/css/styles.css`.
3. Cambia comportamiento en `assets/js/main.js`.
4. No mezcles JavaScript dentro del HTML.
5. No dupliques estilos si ya existe una clase parecida.
6. Usa ids claros si una seccion debe conectarse con el menu.
7. Mantiene los textos alternativos `alt` en imagenes.
8. Prueba siempre en celular cuando toques header, hero, equipo o contacto.

## 10. Como agregar un nuevo programa sin desordenar

1. Agrega una tarjeta en `index.html` dentro de `.program-grid`.
2. Usa un enlace como:

```html
<a href="programas/nuevo-programa.html">Mas informacion</a>
```

3. Crea una pagina dentro de `programas/`:

```html
programas/nuevo-programa.html
```

4. Reutiliza `.program-detail-card` y `.program-timeline`.
5. Solo crea CSS nuevo si el programa necesita un diseno diferente.

## 11. Puntos que todavia se pueden mejorar

- Compactar `assets/css/styles.css`, porque tiene varios ajustes acumulados.
- Separar el CSS por componentes si el proyecto crece.
- Conectar el formulario a un servicio real de correo si se requiere envio por email automatico.
- Revisar que todas las imagenes finales sean propias o tengan permiso de uso.
