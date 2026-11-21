# Originales de los videos (no se publican)

Aquí quedan los videos tal como los entregó la fundación y sus pósteres en JPG. El sitio publica las versiones
comprimidas de `assets/videos/` (H.264, `-crf 28 -preset veryfast -movflags +faststart`, audio AAC de 96 kbps) y
los pósteres en WebP de `assets/img/opt/`. `eleventy.config.mjs` solo copia `assets/videos/*.mp4`, así que esta
carpeta no llega a Vercel.

Para volver a comprimir un video (con ffmpeg instalado):

```
ffmpeg -i originales/NOMBRE.mp4 -c:v libx264 -crf 28 -preset veryfast -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k NOMBRE.mp4
```
