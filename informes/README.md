# Informes y documentos

Aquí van los PDF de transparencia (informes de gestión y documentos legales). El sitio los lista desde
`site.documentos` en `src/_data/site.json`: la sección Informes de la portada y `transparencia.html` muestran cada
uno con su año, su tipo y su peso (se calcula solo al compilar).

## Versión web y versión en alta calidad

Los informes pesados tienen dos archivos:

- `INFORME-…-2025.pdf`: la versión para la web (más liviana), la que se abre con «Ver» y «Descargar PDF».
- `INFORME-…-2025-ALTA-CALIDAD.pdf`: el original, enlazado como «Versión en alta calidad» (campo `archivoAlta`).

Para crear la versión web de un PDF nuevo (con Ghostscript instalado):

```
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=INFORME-…-2026.pdf INFORME-…-2026-ALTA-CALIDAD.pdf
```

## Agregar un documento

1. Copia el PDF en esta carpeta con un nombre en mayúsculas, sin tildes ni espacios.
2. Agrégalo al principio de `documentos` en `site.json` (ver `docs/GUIA-CONTENIDO.md`).
