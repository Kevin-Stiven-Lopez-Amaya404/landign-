# Fundación Amigos Como Arroz

Página web institucional para la Fundación Amigos Como Arroz. Es un sitio estático hecho con HTML, CSS y JavaScript puro.

## Cómo abrirlo

Abre `index.html` directamente en el navegador.

Si prefieres levantarlo con servidor local, puedes usar cualquier servidor estático sencillo desde esta carpeta.

## Estructura

```text
fundacion/
  index.html                    Página principal
  assets/
    css/styles.css              Estilos, responsive y animaciones
    js/main.js                  Interacciones del sitio
    img/
      brand/                    Logo e identidad visual
      hero/                     Imagen principal
      content/                  Imágenes de secciones y momentos
      team/                     Fotos del equipo
  programas/
    index.html                  Vista general de todos los programas
    semilla.html                Detalle individual de Semilla
    siembra.html                Detalle individual de Siembra
    cosecha.html                Detalle individual de Cosecha
    psicosocial.html            Detalle individual de Acompañamiento Psicosocial
  docs/
    DOCUMENTACION.md            Guía completa del proyecto
    PROGRAMAS.md                Explicación del index de Programas
    CODIGO.md                   Documentación técnica del código
  README.md                     Resumen rápido
```

## Qué incluye

- Diseño responsivo.
- Menú móvil.
- Animaciones al hacer scroll.
- Contadores animados.
- Barra de progreso de lectura.
- Carrusel del equipo.
- Videos incrustados.
- Formulario que abre WhatsApp con el mensaje armado.
- Dock flotante de redes sociales.
- Botón para volver al inicio.
- Analítica opcional para contar visitas reales con Google Analytics 4.

## Contador de visitas

El sitio ya queda preparado para contar personas y visitas reales con Google Analytics 4.

Para activarlo:

1. Crea una propiedad web en Google Analytics 4.
2. Copia el ID de medición, normalmente con formato `G-XXXXXXXXXX`.
3. En `assets/js/analytics.js`, busca:

```js
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
```

4. Reemplaza `G-XXXXXXXXXX` por tu ID real y publica la pagina.

Cuando publiques la página, Google Analytics empezará a mostrar usuarios, visitas, páginas vistas y clics importantes como WhatsApp, donar y voluntariado.

## Despliegue

El sitio es estatico. Para publicarlo, sube la carpeta completa a tu hosting o conecta este repositorio a GitHub Pages, Netlify, Vercel u otro servicio de sitios estaticos.

Antes de publicar, revisa [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md).

## Documentación principal

La explicación completa está en:

[docs/DOCUMENTACION.md](docs/DOCUMENTACION.md)

También quedan guías específicas en:

- [docs/README.md](docs/README.md)
- [docs/GUIA_PROGRAMADOR.md](docs/GUIA_PROGRAMADOR.md)
- [docs/PROGRAMAS.md](docs/PROGRAMAS.md)
- [docs/CODIGO.md](docs/CODIGO.md)

Ahí encontrarás:

- Qué hace cada archivo.
- Cómo está organizada cada sección.
- Cómo cambiar textos, imágenes, videos, programas, equipo y contacto.
- Cómo funciona el JavaScript.
- Cómo leer el CSS.
- Revisión del código con puntos fuertes y riesgos.
- Checklist antes de publicar.

## Mantenimiento rápido

- Cambios de contenido: edita `index.html`.
- Cambios visuales: edita `assets/css/styles.css`.
- Cambios de interacción: edita `assets/js/main.js`.
- Cambios de programas: edita los archivos dentro de `programas/`.
- Cambios de WhatsApp: busca el número en `index.html` y `assets/js/main.js`.

## Recomendación

Antes de publicar, revisa especialmente nombres reales del equipo, teléfono, correo, redes sociales, videos oficiales e imágenes definitivas.
