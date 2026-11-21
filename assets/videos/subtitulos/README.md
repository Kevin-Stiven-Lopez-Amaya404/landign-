# Subtítulos de los videos

Cada video puede tener subtítulos en español en un archivo **WebVTT** (`.vtt`) guardado en esta carpeta.

## Cómo agregarlos

1. Crea el archivo con el mismo nombre del video, por ejemplo `testimonio1.vtt` para `testimonio1.mp4`.
2. En `src/_data/site.json`, en el testimonio que corresponde, escribe la ruta en `subtitulos`:
   `"subtitulos": "assets/videos/subtitulos/testimonio1.vtt"`.
3. Si además tienes la transcripción completa (un texto o un PDF), ponla en `transcripcion`: debajo del video
   aparece el enlace «Leer la transcripción».

## Formato

El archivo empieza con `WEBVTT`, una línea en blanco y luego bloques con el tiempo (horas opcionales,
minutos, segundos y milésimas) y el texto que se ve en pantalla. Entre bloques va una línea en blanco.

```
WEBVTT

00:00:00.000 --> 00:00:04.000
Hola, me llamo Ana y llegué a la fundación en 2019.

00:00:04.500 --> 00:00:09.000
Aquí aprendí a creer en lo que puedo lograr.
```

- Guárdalo en UTF-8 para que las tildes y la ñ se vean bien.
- Máximo dos líneas por bloque y unos 40 caracteres por línea.
- Escribe también los sonidos importantes entre corchetes, por ejemplo `[Música]` o `[Aplausos]`.
- Prueba el video en el navegador: el botón CC del reproductor muestra u oculta los subtítulos.
