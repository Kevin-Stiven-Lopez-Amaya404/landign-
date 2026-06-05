# Documentacion del index de Programas

Esta documentacion explica como esta organizado el apartado de Programas en la pagina principal y como se conecta con las paginas detalle dentro de `programas/`.

## 1. Punto de entrada en `index.html`

El bloque principal se encuentra en la seccion:

```html
<section class="section section-programs" id="programas">
```

Esta seccion es la que aparece cuando el usuario navega al apartado **Programas** desde el menu.

## 2. Encabezado del apartado

Dentro de la seccion aparece primero el encabezado:

```html
<span class="section-eyebrow">Programas</span>
<h2>Acompañamiento para cada etapa.</h2>
<p>Semilla, siembra, cosecha y acompanamiento psicosocial responden a distintos momentos de crecimiento.</p>
```

Su funcion es presentar la intencion general del bloque:

- Mostrar las rutas principales de acompanamiento.
- Explicar que cada ruta responde a una etapa diferente.
- Preparar al usuario para elegir el programa que mas se ajusta a su necesidad.

## 3. Tarjetas de programas

Los programas se muestran dentro del contenedor:

```html
<div class="program-grid">
```

Cada programa usa una tarjeta con la clase:

```html
<article class="program-card">
```

Actualmente hay cuatro tarjetas:

1. **Semilla**
   - Enfocado en desarrollo integral, deporte, cultura, tiempo libre productivo y emprendimiento.
   - Enlace de mas informacion:

```html
<a href="programas/semilla.html">Mas informacion</a>
```

2. **Siembra**
   - Enfocado en becas y acompanamiento para acceder a educacion superior tecnica, tecnologica o profesional.
   - Enlace de mas informacion:

```html
<a href="programas/siembra.html">Mas informacion</a>
```

3. **Cosecha**
   - Enfocado en liderazgo joven, proyectos sociales, servicio e impacto comunitario.
   - Enlace de mas informacion:

```html
<a href="programas/cosecha.html">Mas informacion</a>
```

4. **Acompanamiento Psicosocial**
   - Enfocado en apoyo transversal, desarrollo sano, familias, proceso pedagogico y proyecto de vida.
   - Enlace de mas informacion:

```html
<a href="programas/psicosocial.html">Mas informacion</a>
```

## 4. Como funciona el boton "Mas informacion"

Cada boton envia al usuario a una pagina HTML propia del programa seleccionado.

Ejemplo:

```html
programas/semilla.html
```

Esto significa:

- Abrir la pagina individual del programa.
- Mostrar solo la informacion de esa ruta.
- Mantener un enlace para volver al apartado Programas del inicio.

La misma logica se usa con:

- `programas/siembra.html`
- `programas/cosecha.html`
- `programas/psicosocial.html`

## 5. Organizacion de `programas/`

La carpeta `programas/` esta construida para ampliar la informacion de cada ruta.

Su estructura principal es:

```text
programas/
  index.html
  semilla.html
  siembra.html
  cosecha.html
  psicosocial.html
```

## 6. Encabezado de las paginas de programas

La parte superior de la pagina detalle usa:

```html
<header class="program-detail-header">
```

Incluye:

- El logo de la fundacion.
- Un enlace para volver al bloque de Programas en la pagina principal:

```html
<a href="../index.html#programas">Volver a programas</a>
```

## 7. Hero de la pagina de programas

La presentacion general usa:

```html
<section class="program-detail-hero">
```

Aqui se presenta la idea completa de las rutas:

- Semilla
- Siembra
- Cosecha
- Acompanamiento Psicosocial

Este bloque funciona como introduccion antes de mostrar el detalle de cada programa.

## 8. Estructura interna de cada programa

Cada pagina de programa tiene dos partes:

1. **Tarjeta informativa**

```html
<article class="program-detail-card">
```

Contiene:

- Nombre del programa.
- Titulo corto.
- Descripcion breve.
- Boton de contacto.

2. **Linea de tiempo**

```html
<ol class="program-timeline">
```

Muestra el proceso del programa paso a paso.

## 9. Lineas de tiempo por programa

### Semilla

Identificador:

```html
id="semilla"
```

Etapas:

- Deportivos
- Culturales
- Productivos

### Siembra

Identificador:

```html
id="siembra"
```

Etapas:

- Requisitos
- Beca educativa
- Permanencia

### Cosecha

Identificador:

```html
id="cosecha"
```

Etapas:

- Formacion
- Proyecto
- Impacto

### Acompanamiento Psicosocial

Identificador:

```html
id="psicosocial"
```

Etapas:

- Identificacion
- Orientacion
- Seguimiento

## 10. Estilos relacionados en `assets/css/styles.css`

Los estilos visuales principales estan definidos con estas clases:

- `.section-programs`: controla el bloque de Programas en `index.html`.
- `.program-grid`: organiza las tarjetas de programas.
- `.program-card`: define la apariencia de cada tarjeta.
- `.program-link`: define el boton "Mas informacion".
- `.program-page`: identifica que el usuario esta en la pagina de programas.
- `.program-detail-header`: controla la barra superior de las paginas de programas.
- `.program-detail-hero`: controla la introduccion visual de la pagina detalle.
- `.program-detail-section`: controla cada bloque Semilla, Siembra, Cosecha y Acompanamiento Psicosocial.
- `.program-detail-grid`: organiza la tarjeta y la linea de tiempo.
- `.program-detail-card`: disena la informacion principal del programa.
- `.program-timeline`: disena la linea de tiempo.

## 11. Flujo completo del usuario

El recorrido queda asi:

1. El usuario entra a `index.html`.
2. Navega al apartado **Programas**.
3. Ve las rutas: Semilla, Siembra, Cosecha y Acompanamiento Psicosocial.
4. Hace clic en **Mas informacion**.
5. Se abre la pagina individual del programa.
6. El usuario ve solo la informacion de esa ruta.
7. El usuario lee la informacion breve y la linea de tiempo.
8. Si desea continuar, puede usar el boton de contacto para ir al formulario.

## 12. Recomendacion para mantener limpio el codigo

Cuando se agregue un nuevo programa, se deben actualizar tres partes:

1. Agregar una nueva tarjeta en `index.html`.
2. Agregar una nueva pagina dentro de `programas/`.
3. Agregar o reutilizar estilos en `assets/css/styles.css`.

Para mantener el codigo ordenado, el `href` de la tarjeta debe coincidir siempre con el `id` de la seccion detalle.

Ejemplo:

```html
<a href="programas/nuevo.html">Mas informacion</a>
```

Debe existir tambien:

```html
programas/nuevo.html
```
