---
name: Fundación Amigos Como Arroz
description: La fundación presentada como una presentación de marca, ordenada para quien llega (quiénes somos, programas, impacto, cómo ayudar), con sus colores, su logo y sus fotos reales.
colors:
  vacio: "#fbfaf8"
  tinta: "#ffffff"
  grafito: "#eef3f7"
  niebla: "#dde4ea"
  linea: "rgb(22 32 42 / 0.12)"
  linea-fuerte: "rgb(22 32 42 / 0.28)"
  texto: "#16202a"
  texto-2: "#4a5868"
  texto-3: "#5b6876"
  noche: "#0f1923"
  noche-tarjeta: "#16222e"
  texto-sobre-noche: "#f7f5f2"
  texto-2-sobre-noche: "#ccd4dc"
  acero: "#51595f"
  blanco: "#ffffff"
  rosa: "#e0245e"
  rosa-boton: "#c81d52"
  rosa-claro: "#c81d52"
  rosa-sobre-noche: "#ff7aa4"
  sol: "#f6c21c"
  crema: "#eef3f7"
  crema-texto: "#16202a"
  crema-texto-2: "#4a5868"
typography:
  display:
    fontFamily: "Unbounded, Arial Black, sans-serif"
    fontSize: "clamp(2.5rem, 1rem + 6.4vw, 7rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  display-2:
    fontFamily: "Unbounded, Arial Black, sans-serif"
    fontSize: "clamp(1.5rem, 0.2rem + 5.6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1
  gigante:
    fontFamily: "Unbounded, Arial Black, sans-serif"
    fontSize: "clamp(3rem, 1rem + 9vw, 7.75rem)"
    fontWeight: 800
    lineHeight: 0.9
  headline:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.2rem + 3.2vw, 3.625rem)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.6vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.12
  destacado:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 1vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.25
  lead:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Schibsted Grotesk, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Space Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    letterSpacing: "0.1em"
  nota:
    fontFamily: "Space Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    letterSpacing: "0.1em"
rounded:
  foco: "4px"
  radio-s: "8px"
  pildora: "14px"
  radio: "16px"
  circulo: "50%"
spacing:
  e-1: "4px"
  e-2: "8px"
  e-3: "12px"
  e-4: "16px"
  e-5: "20px"
  e-6: "24px"
  e-7: "32px"
  e-8: "48px"
  margen: "clamp(18px, 5vw, 80px)"
  marco: "clamp(8px, 1.1vw, 16px)"
  pildora: "60px"
  contenedor: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.rosa-boton}"
    textColor: "{colors.blanco}"
    typography: "{typography.body}"
    rounded: "{rounded.radio-s}"
    padding: "0 22px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.rosa}"
  button-whatsapp:
    backgroundColor: "{colors.texto}"
    textColor: "{colors.vacio}"
    typography: "{typography.body}"
    rounded: "{rounded.radio-s}"
    padding: "0 22px"
    height: "50px"
  button-contorno:
    backgroundColor: "rgb(6 6 8 / 0.4)"
    textColor: "{colors.texto}"
    typography: "{typography.label}"
    rounded: "{rounded.radio-s}"
    padding: "0 22px"
    height: "50px"
  pildora:
    backgroundColor: "rgb(17 17 22 / 0.86)"
    textColor: "{colors.texto-2}"
    rounded: "{rounded.pildora}"
    padding: "7px"
    height: "60px"
  pildora-icono:
    backgroundColor: "transparent"
    textColor: "{colors.texto}"
    rounded: "{rounded.circulo}"
    size: "44px"
  entrada-boton:
    backgroundColor: "{colors.rosa-boton}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.circulo}"
    size: "clamp(104px, 11vw, 140px)"
  input:
    backgroundColor: "{colors.vacio}"
    textColor: "{colors.texto}"
    rounded: "{rounded.radio-s}"
    padding: "12px 14px"
    height: "50px"
  historia:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.texto}"
    rounded: "{rounded.radio}"
    padding: "clamp(20px, 2.6vw, 30px)"
    height: "min(68svh, 600px)"
    width: "min(78vw, 440px)"
---

# Design System: Fundación Amigos Como Arroz

## Overview

El sitio se presenta como una **presentación de marca**. Toma el ritmo de las webs de lanzamiento de las marcas de autos:
- pantalla de entrada con un botón central;
- foto enmarcada;
- palabras que cambian con el scroll;
- secciones con su etiqueta (sin números);
- fotos a sangre con una palabra gigante;
- una sección clara;
- un cierre enorme.

La identidad sigue siendo la de la fundación: su logo, el rosa y el amarillo del logo, sus fotos reales y todos sus textos. El usuario eligió la referencia de estilo. De esa marca no se usa nada: ni el nombre, ni los logos, ni las imágenes.

Modo: Persuade. Público: todos por igual (familias y jóvenes, donantes y aliados, voluntarios). Se conserva todo el contenido.

## Colors

### Primary
**Rosa del logo**: `--rosa` #e0245e; en botones, `--rosa-boton` #c81d52; como texto, `--rosa-claro` (#c81d52 en claro, #ff7aa4 en las zonas azul noche). Se usa en:
- las acciones (Donar, Quiero apoyar, Enviar);
- el cuadrito de cada etiqueta de sección;
- el estado activo;
- el punto del cursor.

### Secondary
**Amarillo del logo** (`--sol` #f6c21c). Se usa en:
- las cifras grandes (19 años, impacto, años de los informes);
- el brillo de fondo, junto al rosa;
- el anillo de foco de teclado.

### Neutral (tema claro: seguridad y calma)
La página es clara para verse limpia y transmitir seguridad y tranquilidad (pedido del usuario: «no quiero ese negro»).
- `--vacio` #fbfaf8 (blanco cálido, fondo), `--tinta` #ffffff (tarjetas, panel del menú, chat, formulario), `--grafito` #eef3f7 (azul muy suave: Historia, Momentos e Informes van sobre él para dar ritmo), `--niebla` #dde4ea (bordes).
- Texto `--texto` #16202a (azul noche), `--texto-2` #4a5868, `--texto-3` #5b6876; líneas en azul noche transparente.
- En claro, `--rosa-claro` y `--cifra` son el rosa del botón (#c81d52, 5.6:1 sobre blanco) y el foco es rosa.

### Zonas en azul noche
Solo donde el texto va sobre fotos las mismas variables cambian a azul noche (nunca negro): `--vacio` #0f1923, `--tinta` #16222e, texto #f7f5f2 / #ccd4dc, `--rosa-claro` #ff7aa4 y `--cifra` y el foco en el amarillo del logo. Zonas: `.entrada`, `.hero`, `.sede-espinal-section`, `.historia` (tarjetas de historias y equipo) y, solo en escritorio, la foto y el bloque de texto de la portada de las páginas internas (en celular ese texto va debajo de la foto, en claro).
- Los blancos transparentes para hover y líneas se calculan con `color-mix` desde `--texto`, así sirven en las dos zonas.

### Brillo y velos
- `--brillo`: dos radiales suaves (rosa y amarillo) detrás de la secuencia de palabras, la intro de programas y el contacto.
- `--velo`: degradado inferior sobre fotos a sangre. Sede Espinal oscurece la franja del título para que el texto cumpla AA.

## Typography

- **Unbounded** (ancha, en mayúsculas), solo para los momentos grandes:
  - el nombre en la entrada y en el inicio;
  - la secuencia de palabras y ESPINAL;
  - los nombres de los programas;
  - los títulos «Acompañamiento para cada etapa», «Resultados que transforman» y «Sé parte de la misión»;
  - las cifras y los títulos de las páginas internas.
- **Schibsted Grotesk**: `h2` y `h3` en tono de conversación (minúscula, interlineado apretado) y todo el texto.
- **Space Mono** en mayúsculas espaciadas: etiquetas de sección, fechas y estados. Los botones y los enlaces de la barra van en Schibsted Grotesk (600, 16 y 14 px), con mayúscula inicial: se leen mejor.

### Escala
Diez papeles, con los tamaños de la referencia (`--t-*` en `sitio.css`); ningún `font-size` va escrito a mano:
- `--t-nota` 0.75 rem: sellos, fechas, estados, enlaces de la barra.
- `--t-etiqueta` 0.875 rem: etiquetas de sección, enlaces de la barra, pies de foto, errores.
- `--t-cuerpo` 1 rem y `--t-lead` 1.125 rem: texto, botones y entradillas.
- `--t-destacado` 20–24 px: citas y títulos de tarjeta.
- `--t-h3` 24–36 px, `--t-h2` 32–58 px: títulos.
- `--t-display-2` 24–72 px, `--t-h1` 40–112 px, `--t-gigante` 48–124 px: momentos grandes en Unbounded.
Los tamaños grandes se achican con el ancho; `--t-display-2` arranca en 24 px para que «ACOMPAÑAMIENTO» quepa a 390 px.

### Named Rules
- Una sola palabra o frase ancha por pantalla.
- Las frases largas nunca van en Unbounded, porque es muy ancha.

## Layout

- **Entrada** (`#entrada`): «AMIGOS (Entrar) COMO ARROZ» sobre un brillo que gira, con el logo arriba y el lema abajo.
  - Solo aparece con JS, una vez por sesión, y nunca si se llega con un enlace a una sección.
  - Se cierra con el botón, con la rueda, deslizando o con el teclado.
- **Inicio**: foto enmarcada (`--marco`) con esquinas redondeadas.
  - Arriba a la izquierda, el sello «Amigos Como Arroz / Fundación · Neiva y Espinal».
  - Abajo a la izquierda, el nombre, el texto y los botones; a la derecha, «Sigue» en vertical.
  - La foto de los fundadores mide 868 px: en escritorio va a la derecha sobre su copia desenfocada; en celular, arriba a todo el ancho.
- **Secuencia de palabras** (`.ciclo`): la pantalla queda fija mientras el scroll cambia Educación, Liderazgo, Bienestar y Comunidad. Son dos pantallas de recorrido; repite la frase del inicio, así que es decorativa y no se muestra en celular.
- **Orden de la portada** (auditoría HU24): Inicio → Fundación + Historia («Quiénes somos») → Programas (con «¿Cómo participar?») → Impacto → Navidad → Testimonios → Talentos → Sede Espinal → Momentos → Equipo → Informes → Contacto. El menú sigue ese orden.
- **Etiqueta de sección**: «■ Nombre» en monoespaciada encima del título, sin número.
- **Composición por sección**:
  - Fundación y programas: texto a un lado y foto enmarcada al otro.
  - Historia: tarjeta con el visor y la foto.
  - Sede Espinal: foto a sangre con ESPINAL gigante.
  - Momentos: sección clara, con cuatro columnas en escritorio.
- **Barra flotante**: abajo al centro (`.site-header` en la portada, `.program-detail-header` en las internas).

## Spacing
Escala de 4 en 4 px (`--e-1` a `--e-8`: 4, 8, 12, 16, 20, 24, 32, 48) para todas las separaciones entre hermanos (`gap`). Los márgenes de página y de sección usan `--margen` y los `clamp()` de `.pantalla`.

## Elevation & Depth

La única sombra, `--sombra`, se usa en la píldora, en el panel del menú y en el chat. Todo lo demás es plano: líneas finas (`--linea`) separan las filas.

## Shapes

Radios de 8 px (botones, campos), 14 px (píldora) y 16 px (fotos, tarjetas). Círculos para los íconos de la barra y el botón de entrada.

## Components

### Barra flotante
- **Portada**: logo, enlaces de sección, Compartir, Donar (rosa, lleva a `#donar`), WhatsApp y el asistente.
- **Hasta 1079 px**: los enlaces se abren en un panel encima de la píldora; Donar, WhatsApp y el asistente siguen a la vista.
- **Páginas internas**: logo, volver, Donar, WhatsApp y Programas.

### Línea de progreso
`#historias`: tramos de 2 px arriba, uno por sección, que se llenan de rosa a amarillo con el scroll.

### Punto del cursor
Punto rosa que sigue al mouse y crece sobre enlaces y botones. Solo aparece con un mouse y si la persona no pidió menos movimiento.

### Fotos y videos: nunca cortar a las personas
- Ninguna foto se recorta para llenar una caja. En las cajas de forma fija (tarjetas de talentos, historias, equipo y videos, foto de «Nuestra historia», portada de las páginas internas en escritorio) la foto va entera (`contain`) y el hueco lo llena la misma foto desenfocada (`modules/encaje.js`).
- Galerías, Momentos, programas y Fundación: la caja toma la proporción de cada foto; las tiras de las páginas internas igualan la altura.
- Fotos a sangre (inicio, Sede Espinal): en celular van en una franja con su proporción y el texto debajo.
- Los videos se ven completos, sin agrandarse más que su resolución.
- Cada `srcset` lista todos los anchos que existen en `assets/img/opt`.

### Acciones
Tres acciones con nombre fijo en toda la página: **Donar** (siempre a `#donar`, en Contacto), **Ser voluntario** e **Inscribirme** (WhatsApp con el programa ya escrito). WhatsApp como canal se llama «Escribir por WhatsApp»; los enlaces a otra página dicen adónde van («Conocer el programa», «Conocer la sede»).
- «Cómo donar» (en Contacto) solo aparece cuando `site.json` trae `donacion.medios` reales.
- El formulario abre WhatsApp y lo dice en el botón; teléfono y correo son opcionales.

### Carruseles
Tarjetas de 440 px de ancho máximo con esquinas redondeadas; las de talentos son más bajas (470 px) porque sus fotos son horizontales. La foto crece un poco al pasar el cursor.

### Inputs
Fondo `--vacio`, borde `--linea-fuerte` y contorno rosa al enfocar. Las etiquetas van en Space Mono.

### Movimiento (GSAP)
Mismos tiempos y curvas que la referencia, recreados con código propio: salida exponencial (`expo.out`, como 0.16, 1, 0.3, 1) para lo que entra; duraciones de 0.5 s (revelar), 0.8 s (aparecer) y 1.2 s (inicio).
- Entrada («AMIGOS (Entrar) COMO ARROZ»): solo en pantallas de 900 px o más y en la primera visita de la sesión; se cierra sola a los 1,2 s o con el primer gesto. Su fondo son degradados radiales quietos (sin el cónico que giraba, que era costoso).
- Inicio: la foto se pinta desde el primer momento y se asienta (escala 1,12 → 1) y el nombre sube línea a línea; al bajar, la foto se aleja y se apaga.
- Secuencia: la frase se escribe con cursor y las palabras cambian con desenfoque; dos brillos se desplazan detrás.
- Títulos de sección: las letras se encienden una tras otra (0.026 s), como el «Statement» de la referencia.
- Fotos: se descubren de abajo hacia arriba y se asientan; las de Programas tienen paralaje.
- Sede Espinal (escritorio): la pantalla se queda fija mientras la foto se asienta, ESPINAL aparece desde un desenfoque y sube el texto, como «The Shift».
- Programas (escritorio): cada tarjeta se queda quieta y la siguiente sube por encima.
- Tarjetas de carruseles e informes: suben en grupo, una tras otra (0.08 s), cuando su fila entra a la pantalla.
- Carruseles (con mouse): se arrastran con inercia y el cursor dice «Arrastra»; sobre un video, «Ver». Con teclado, flechas; todos tienen Anterior y Siguiente.
- Rendimiento: GSAP se carga después de la primera pintura y cada efecto se arma en una tarea corta; los títulos se dividen en letras solo cuando están por aparecer.
- Impacto: filas escalonadas (0.18 s) y líneas que se dibujan.
- Con movimiento reducido no corre nada de esto; en celulares todo se mueve, pero sin desenfoques ni pantallas fijas.

### Temporada de Navidad
La guirnalda va sobre la píldora y el botón de nieve es un ícono más de la barra.

## Do's and Don'ts

### Do:
- Conservar todo el texto, las imágenes, el logo y la información de los programas.
- Usar el rosa para acciones y el amarillo para cifras.
- Medir el contraste de cada texto sobre foto.

### Don't:
- No copiar nombres, logos ni imágenes de la marca de referencia.
- No poner frases largas en Unbounded.
- No bloquear al visitante: la entrada se salta con un enlace a una sección y no se repite en la sesión.
